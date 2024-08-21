import { getEnvOrThrow } from "@/lib/utils"
import { LaAccount } from "@/web/lib/schema"
import { startWorker } from "jazz-nodejs"
import { Group, ID } from "jazz-tools"
import { appendFile } from "node:fs/promises"
import path from "path"
import fs from "fs/promises"
import {
	ListOfGlobalTopics,
	PublicGlobalGroup,
	PublicGlobalGroupRoot,
	GlobalTopic
} from "@/web/lib/schema/global-topic"

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
			default:
				console.log("Unknown command")
				break
		}
		console.log("done")
	} catch (err) {
		console.error("Error occurred:", err)
	}
}

// sets up jazz global group and writes it to .env
async function setup() {
	const { worker } = await startWorker({
		accountID: "co_zhvp7ryXJzDvQagX61F6RCZFJB9",
		accountSecret: JAZZ_WORKER_SECRET
	})
	const user = (await await LaAccount.createAs(worker, {
		creationProps: { name: "nikiv" }
	}))!
	const publicGlobalGroup = PublicGlobalGroup.create({ owner: worker })
	publicGlobalGroup.root = PublicGlobalGroupRoot.create({}, { owner: publicGlobalGroup })
	publicGlobalGroup.addMember("everyone", "reader")
	await appendFile("./.env", `\nJAZZ_PUBLIC_GLOBAL_GROUP=${JSON.stringify(publicGlobalGroup.id)}`)
	const adminGlobalGroup = Group.create({ owner: worker })
	adminGlobalGroup.addMember(user, "admin")
	await appendFile("./.env", `\nJAZZ_ADMIN_GLOBAL_GROUP=${JSON.stringify(adminGlobalGroup.id)}`)
}

async function prodSeed() {
	const { worker } = await startWorker({
		accountID: "co_zhvp7ryXJzDvQagX61F6RCZFJB9",
		accountSecret: JAZZ_WORKER_SECRET
	})
	const globalGroup = await (
		(await PublicGlobalGroup.load(process.env.JAZZ_PUBLIC_GLOBAL_GROUP as ID<Group>, worker, {})) as PublicGlobalGroup
	).ensureLoaded({ root: true })
	if (!globalGroup) return // TODO: err

	const folderPath = path.join(__dirname, "..", "private")
	const files = await fs.readdir(folderPath)
	for (const file of files) {
		if (file === ".git") continue
		const filePath = path.join(folderPath, file)
		const stats = await fs.stat(filePath)

		if (stats.isDirectory()) {
			if (file === "edgedb-dump") {
				const edgedbFiles = await fs.readdir(filePath)
				for (const subFile of edgedbFiles) {
					const edgedbFilePath = path.join(filePath, subFile)
					console.log(edgedbFilePath, "file path")
				}
			}
		} else if (stats.isFile()) {
			if (file === "topics.json") {
				const content = await fs.readFile(filePath, "utf-8")
				const topics = JSON.parse(content) as Array<{ name: string; prettyName: string }>

				topics.forEach(topic => {
					GlobalTopic.create({ name: topic.name, prettyName: topic.prettyName }, { owner: globalGroup })
				})
			}
			// TODO: intentional mistake with nn (remove after edgedb dump is ported, topics etc.)
			if (file === "connections.jsonn") {
				const content = await fs.readFile(filePath, "utf-8")
				const topics = JSON.parse(content) as Array<{ name: string; prettyName: string; connections: string[] }>

				const createdTopics: { [name: string]: { node: GlobalTopic; connections: string[] } } = Object.fromEntries(
					topics.map(topic => {
						const node = GlobalTopic.create(
							{
								name: topic.name,
								prettyName: topic.prettyName,
								connections: ListOfGlobalTopics.create([], { owner: globalGroup })
							},
							{ owner: globalGroup }
						)

						const connections = topic.connections

						return [topic.name, { node, connections }]
					})
				)

				for (const [topicName, { node, connections }] of Object.entries(createdTopics)) {
					for (const connection of connections) {
						const connectionNode = createdTopics[connection].node
						node.connections!.push(connectionNode)
					}
				}
				// const graph = GlobalTopicGraph.create(
				// 	Object.values(createdTopics).map(({ node }) => node),
				// 	{ owner: globalGroup }
				// )
				// await writeToOutput(graph, "graph.json")
				// globalGroup.root.topics = graph
				// await new Promise(resolve => setTimeout(resolve, 1000))
			}
		}
	}
}

async function writeToOutput(content: any, file: string) {
	const outputDir = path.join(__dirname, "..", "output")
	await fs.mkdir(outputDir, { recursive: true })
	const outputPath = path.join(outputDir, file)
	await fs.writeFile(outputPath, JSON.stringify(content, null, 2))
}

await seed()
