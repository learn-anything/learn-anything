import { startWorker } from "jazz-nodejs"
import { ID } from "jazz-tools"
import { appendFile, readFile, readdir, stat } from "node:fs/promises"
import path from "path"
import { getEnvOrThrow } from "@/lib/utils"
import { PublicGlobalGroup, PublicGlobalGroupRoot } from "@/web/lib/schema/master/public-group"
import { Connection, ForceGraph, ListOfConnections, ListOfForceGraphs } from "@/web/lib/schema/master/force-graph"
import { ListOfTopics } from "@/web/lib/schema"

const JAZZ_WORKER_ACCOUNT_ID = getEnvOrThrow("JAZZ_WORKER_ACCOUNT_ID")
const JAZZ_WORKER_SECRET = getEnvOrThrow("JAZZ_WORKER_SECRET")

async function createWorker() {
	return startWorker({
		accountID: JAZZ_WORKER_ACCOUNT_ID,
		accountSecret: JAZZ_WORKER_SECRET
	})
}

async function setup() {
	const { worker } = await createWorker()

	try {
		const publicGlobalGroup = PublicGlobalGroup.create({ owner: worker })
		publicGlobalGroup.root = PublicGlobalGroupRoot.create(
			{
				forceGraphs: ListOfForceGraphs.create([], { owner: publicGlobalGroup }),
				topics: ListOfTopics.create([], { owner: publicGlobalGroup })
			},
			{ owner: publicGlobalGroup }
		)
		publicGlobalGroup.addMember("everyone", "reader")

		await appendFile("./.env", `JAZZ_PUBLIC_GLOBAL_GROUP=${JSON.stringify(publicGlobalGroup.id)}`)

		console.log("Setup completed successfully")
	} catch (error) {
		console.error("Setup failed:", error)
		throw error
	}
}

async function readJsonFile(filePath: string) {
	const content = await readFile(filePath, "utf-8")
	return JSON.parse(content)
}

async function prodSeed() {
	const { worker } = await createWorker()

	try {
		const globalGroupId = process.env.JAZZ_PUBLIC_GLOBAL_GROUP as ID<PublicGlobalGroup>
		const globalGroup = await PublicGlobalGroup.load(globalGroupId, worker, {
			root: {
				forceGraphs: [{ connections: [] }]
			}
		})
		if (!globalGroup) throw new Error("Failed to load global group")

		const folderPath = path.join(__dirname, "..", "private")
		const files = await readdir(folderPath)

		for (const file of files) {
			if (file === ".git" || file === "edgedb-dump") continue

			const filePath = path.join(folderPath, file)
			const stats = await stat(filePath)

			if (stats.isFile() && file === "connections.json") {
				const forceGraphs = (await readJsonFile(filePath)) as Array<{
					name: string
					prettyName: string
					connections: string[]
				}>
				await processTopics(forceGraphs)
			}
		}

		console.log("Production seeding completed successfully")
	} catch (error) {
		console.error("Production seeding failed:", error)
		throw error
	}
}

async function processTopics(forceGraphs: Array<{ name: string; prettyName: string; connections: string[] }>) {
	const { worker } = await createWorker()

	const globalGroupId = process.env.JAZZ_PUBLIC_GLOBAL_GROUP as ID<PublicGlobalGroup>
	const globalGroup = await PublicGlobalGroup.load(globalGroupId, worker, {
		root: {
			forceGraphs: [{ connections: [] }]
		}
	})
	if (!globalGroup) throw new Error("Failed to load global group")

	// Step 1: Create a map of all unique connections
	const allConnections = new Map<string, Set<string>>()

	forceGraphs.forEach(forceGraph => {
		if (!allConnections.has(forceGraph.name)) {
			allConnections.set(forceGraph.name, new Set())
		}

		forceGraph.connections.forEach(connection => {
			allConnections.get(forceGraph.name)!.add(connection)

			if (!allConnections.has(connection)) {
				allConnections.set(connection, new Set())
			}
			allConnections.get(connection)!.add(forceGraph.name)
		})
	})

	// Step 1.5: Create TopicConnections
	const connections = Array.from(allConnections.values()).map(connections => Array.from(connections))
	const uniqueConnections = [...new Set(connections.flat())]

	const createdConnections = new Map<string, Connection>()

	uniqueConnections.forEach(value => {
		const connectionNode = Connection.create({ name: value }, { owner: globalGroup })
		createdConnections.set(value, connectionNode)
	})

	// Step 2: Create Topics with unique connections
	const createdTopics = new Map<string, ForceGraph>()

	forceGraphs.forEach(forceGraph => {
		const node = ForceGraph.create(
			{
				name: forceGraph.name,
				prettyName: forceGraph.prettyName,
				connections: ListOfConnections.create([], { owner: globalGroup })
			},
			{ owner: globalGroup }
		)
		createdTopics.set(forceGraph.name, node)
	})

	// Step 3: Add connections to each node
	for (const [forceGraphName, connections] of allConnections) {
		const forceGraph = createdTopics.get(forceGraphName)

		if (forceGraph && forceGraph.id) {
			for (const connection of connections) {
				const connectionNode = createdConnections.get(connection)

				if (connectionNode && connectionNode.id) {
					console.log("Adding connection to forceGraph", forceGraph, connectionNode)
					forceGraph.connections?.push(connectionNode)
				}
			}
		}
	}

	Array.from(createdTopics.values()).forEach(forceGraph => {
		if (forceGraph && forceGraph.id) {
			console.log("Adding forceGraph to graph", forceGraph)
			globalGroup.root.forceGraphs?.push(forceGraph)
		}
	})

	// Step 4: Create the graph
	// const graph = ListOfTopics.create(Array.from(createdTopics.values()), { owner: globalGroup })

	// Step 5: Assign the graph to the global group
	// globalGroup.root.forceGraphs = graph

	await new Promise(resolve => setTimeout(resolve, 1000))
}

async function main() {
	const command = process.argv[2]

	try {
		switch (command) {
			case "setup":
				await setup()
				break
			case "prod":
				await prodSeed()
				break
			default:
				console.log("Usage: node script.js [setup|prod]")
				process.exit(1)
		}
	} catch (err) {
		console.error("An error occurred:", err)
		process.exit(1)
	}
}

main().catch(console.error)
