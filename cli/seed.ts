import { getEnvOrThrow } from "@/lib/utils"
import { LaAccount } from "@/web/lib/schema"
import { startWorker } from "jazz-nodejs"
import { Group, ID } from "jazz-tools"
import { appendFile } from "node:fs/promises"
import path from "path"
import fs from "fs/promises"
import {
	GlobalTopicGraph,
	ListOfTopicGraphNodes,
	PublicGlobalGroup,
	PublicGlobalGroupRoot,
	TopicGraphNode
} from "@/web/lib/schema/global-topic-graph"

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
			// // TODO: do after connections.json
			// if (file === "edgedb-dump") {
			// 	const subFiles = await fs.readdir(filePath)
			// 	for (const subFile of subFiles) {
			// 		const subFilePath = path.join(filePath, subFile)
			// 	}
			// }
		} else if (stats.isFile()) {
			if (file === "connections.json") {
				const content = await fs.readFile(filePath, "utf-8")
				const topics = JSON.parse(content) as Array<{ name: string; prettyName: string; connections: string[] }>

				const createdTopics: { [name: string]: { node: TopicGraphNode; connections: string[] } } = Object.fromEntries(
					topics.map(topic => {
						const node = TopicGraphNode.create(
							{
								name: topic.name,
								prettyName: topic.prettyName,
								connectedTopics: ListOfTopicGraphNodes.create([], { owner: globalGroup })
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
						node.connectedTopics!.push(connectionNode)
					}
				}

				const graph = GlobalTopicGraph.create(
					Object.values(createdTopics).map(({ node }) => node),
					{ owner: globalGroup }
				)
				console.log(graph, "graph")

				globalGroup.root.topicGraph = graph

				await new Promise(resolve => setTimeout(resolve, 1000))
			}
		}
	}
}

await seed()
