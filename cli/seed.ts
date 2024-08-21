import { getEnvOrThrow } from "@/lib/utils"
import { ListOfForceGraphs } from "@/web/lib/schema/master/force-graph"
import { PublicGlobalGroup, PublicGlobalGroupRoot } from "@/web/lib/schema/master/public-group"
import {
	LatestGlobalGuide,
	Link,
	ListOfLinks,
	ListOfSections,
	ListOfTopics,
	Section,
	Topic
} from "@/web/lib/schema/master/topic"
import fs from "fs/promises"
import { startWorker } from "jazz-nodejs"
import { Group, ID } from "jazz-tools"
import { appendFile } from "node:fs/promises"
import path from "path"

const JAZZ_WORKER_SECRET = getEnvOrThrow("JAZZ_WORKER_SECRET")

async function seed() {
	const args = Bun.argv
	const command = args[2]
	try {
		switch (command) {
			case undefined:
				console.log("No command provided")
				break
			case "setup":
				await setup()
				break
			case "prod":
				await prodSeed()
				break
			case "fullProdRebuild":
				await fullProdRebuild()
				break
			default:
				console.log("Unknown command")
				break
		}
		console.log("done")
	} catch (err) {
		console.error("Error occurred:", err)
	}
}

// sets up jazz global/admin group and writes it to .env
async function setup() {
	const { worker } = await startWorker({
		accountID: "co_zhvp7ryXJzDvQagX61F6RCZFJB9",
		accountSecret: JAZZ_WORKER_SECRET
	})
	// const user = (await await LaAccount.createAs(worker, {
	// 	creationProps: { name: "nikiv" }
	// }))!
	const publicGlobalGroup = PublicGlobalGroup.create({ owner: worker })
	publicGlobalGroup.root = PublicGlobalGroupRoot.create(
		{
			topics: ListOfTopics.create([], { owner: publicGlobalGroup }),
			forceGraphs: ListOfForceGraphs.create([], { owner: publicGlobalGroup })
		},
		{ owner: publicGlobalGroup }
	)
	publicGlobalGroup.addMember("everyone", "reader")
	await appendFile("./.env", `\nJAZZ_PUBLIC_GLOBAL_GROUP=${JSON.stringify(publicGlobalGroup.id)}`)
	const adminGlobalGroup = Group.create({ owner: worker })
	// adminGlobalGroup.addMember(user, "admin")
	console.log("created admin group", adminGlobalGroup.id)
	// console.log(user.id)
	await appendFile("./.env", `\nJAZZ_ADMIN_GLOBAL_GROUP=${JSON.stringify(adminGlobalGroup.id)}`)

	// make sure newly created groups have time to be synced
	await new Promise(resolve => setTimeout(resolve, 1000))
}

// for now this seeds the GlobalTopics + their study guides
// all the data comes from private/ folder
async function prodSeed() {
	const { worker } = await startWorker({
		accountID: "co_zhvp7ryXJzDvQagX61F6RCZFJB9",
		accountSecret: JAZZ_WORKER_SECRET
	})
	console.log(process.env.JAZZ_PUBLIC_GLOBAL_GROUP, "group?")
	const globalGroupId = process.env.JAZZ_PUBLIC_GLOBAL_GROUP as ID<PublicGlobalGroup>
	const globalGroup = await PublicGlobalGroup.load(globalGroupId, worker, {
		root: {
			topics: [{ connections: [], globalGuide: { sections: [] } }]
		}
	})
	if (!globalGroup) throw new Error("Failed to load global group")
	console.log("group loaded")

	const folderPathWithGlobalTopics = path.join(__dirname, "..", "private", "data", "edgedb", "topics")
	try {
		const topicFiles = await fs.readdir(folderPathWithGlobalTopics)
		topicFiles.sort((a, b) => a.localeCompare(b))
		// console.log("Files in private/data/edgedb/topics:")

		const file = topicFiles[0]
		const filePath = path.join(folderPathWithGlobalTopics, file)
		const content = await fs.readFile(filePath, "utf-8")
		const data = JSON.parse(content)

		const fileName = file.split(".")[0]

		if (!data.latestGlobalGuide) {
			console.error("No sections found in", fileName)
			return
		}
		const name = data.name
		const prettyName = data.prettyName

		const topic = Topic.create(
			{
				name,
				prettyName,
				latestGlobalGuide: LatestGlobalGuide.create(
					{ sections: ListOfSections.create([], { owner: globalGroup }) },
					{ owner: globalGroup }
				)
			},
			{ owner: globalGroup }
		)

		console.log("topic created", topic)

		const sections = data.latestGlobalGuide.sections

		for (const section of sections) {
			const sectionTitle = section.title
			const sectionsLinks = section.links

			const sectionModel = Section.create(
				{
					title: sectionTitle,
					links: ListOfLinks.create([], { owner: globalGroup })
				},
				{ owner: globalGroup }
			)

			console.log("section created", sectionModel)

			// TODO: make sure that links of same `url` are not duplicated in GlobalLink
			for (const link of sectionsLinks) {
				const linkModel = Link.create(
					{
						title: link.title,
						url: link.url
					},
					{ owner: globalGroup }
				)
				sectionModel.links?.push(linkModel)
			}

			console.log("links added to section", sectionModel)
			topic.latestGlobalGuide?.sections?.push(sectionModel)
		}
	} catch (error) {
		console.error("Error reading directory:", error)
	}
}

// const folderPath = path.join(__dirname, "..", "private")
// const files = await fs.readdir(folderPath)
// for (const file of files) {
// 	if (file === ".git") continue
// 	const filePath = path.join(folderPath, file)
// 	const stats = await fs.stat(filePath)

// 	if (stats.isDirectory()) {
// 		// if datare folder go inside it and read files
// 		if (file === "data") {
// 			console.logturn
// 			const dataFiles = await fs.readdir(filePath)
// 			for (const subFile of dataFiles) {
// 				const dataFilePath = path.join(filePath, subFile)
// 				const content = await fs.readFile(dataFilePath, "utf-8")
// 				const data = JSON.parse(content)
// 				console.log(data, "data")
// 			}
// 		}

// 		if (file === "lastprod") {
// 			console.log("lastprod folder")
// 			const edgedbFiles = await fs.readdir(filePath)
// 			for (const subFile of edgedbFiles) {
// 				console.log(subFile, "sub file")
// 				const edgedbFilePath = path.join(filePath, subFile)
// 				console.log(edgedbFilePath, "file path")
// 			}
// 		}
// 	} else if (stats.isFile()) {
// 		if (file === "force-graph-connections.json") {
// 			const content = await fs.readFile(filePath, "utf-8")
// 			const topics = JSON.parse(content) as Array<{ name: string; prettyName: string; connections: string[] }>

// 			const createdTopics: { [name: string]: { node: GlobalTopic; connections: string[] } } = Object.fromEntries(
// 				topics.map(topic => {
// 					const node = GlobalTopic.create(
// 						{
// 							name: topic.name,
// 							prettyName: topic.prettyName,
// 							connections: ListOfGlobalTopics.create([], { owner: globalGroup })
// 						},
// 						{ owner: globalGroup }
// 					)

// 					const connections = topic.connections

// 					return [topic.name, { node, connections }]
// 				})
// 			)

// 			for (const [topicName, { node, connections }] of Object.entries(createdTopics)) {
// 				for (const connection of connections) {
// 					const connectionNode = createdTopics[connection].node
// 					node.connections!.push(connectionNode)
// 				}
// 			}
// const graph = GlobalTopicGraph.create(
// 	Object.values(createdTopics).map(({ node }) => node),
// 	{ owner: globalGroup }
// )
// await writeToOutput(graph, "graph.json")
// globalGroup.root.topics = graph
// await new Promise(resolve => setTimeout(resolve, 1000))
// }
// if (file === "topics.json") {
// 	const content = await fs.readFile(filePath, "utf-8")
// 	const topics = JSON.parse(content) as Array<{ name: string; prettyName: string }>

// 	topics.forEach(topic => {
// 		GlobalTopic.create({ name: topic.name, prettyName: topic.prettyName }, { owner: globalGroup })
// 	})
// }
// }
// 	}
// }

async function test() {
	const folderPath = path.join(__dirname, "..", "private", "data", "edgedb", "topics")
	try {
		const files = await fs.readdir(folderPath)
		console.log("Files in private/data/edgedb/topics:")
		files.forEach(file => console.log(file))
	} catch (error) {
		console.error("Error reading directory:", error)
	}
}

async function fullProdRebuild() {
	await setup()
	await prodSeed()
}

// async function writeToOutput(content: any, file: string) {
// 	const outputDir = path.join(__dirname, "..", "output")
// 	await fs.mkdir(outputDir, { recursive: true })
// 	const outputPath = path.join(outputDir, file)
// 	await fs.writeFile(outputPath, JSON.stringify(content, null, 2))
// }

await seed()
