import { getEnvOrThrow } from "@/lib/utils"
import { Connection, ForceGraph, ListOfConnections, ListOfForceGraphs } from "@/web/lib/schema/master/force-graph"
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
import { ID } from "jazz-tools"
import { appendFile } from "node:fs/promises"
import path from "path"

// Define interfaces for JSON data structures
interface LinkJson {
	id?: ID<Link>
	title: string
	url: string
}

interface SectionJson {
	title: string
	links: LinkJson[]
}

interface TopicJson {
	name: string
	prettyName: string
	latestGlobalGuide: {
		sections: SectionJson[]
	} | null
}

// Get the Jazz worker secret from environment variables
const JAZZ_WORKER_SECRET = getEnvOrThrow("JAZZ_WORKER_SECRET")

/**
 * Manages links, handling deduplication and tracking duplicates.
 */
class LinkManager {
	private links: Map<string, LinkJson> = new Map()
	private duplicateCount: number = 0

	/**
	 * Adds a link to the manager, tracking duplicates.
	 * @param link - The link to add.
	 */
	addLink(link: LinkJson) {
		const key = link.url
		if (this.links.has(key)) {
			this.duplicateCount++
		} else {
			this.links.set(key, link)
		}
	}

	/**
	 * Gets all unique links.
	 * @returns An array of unique links.
	 */
	getAllLinks() {
		return Array.from(this.links.values())
	}

	/**
	 * Gets the count of duplicate links.
	 * @returns The number of duplicate links.
	 */
	getDuplicateCount() {
		return this.duplicateCount
	}
}

/**
 * Starts a Jazz worker.
 * @returns A Promise that resolves to the started worker.
 */
async function startJazzWorker() {
	const { worker } = await startWorker({
		accountID: "co_zhvp7ryXJzDvQagX61F6RCZFJB9",
		accountSecret: JAZZ_WORKER_SECRET
	})
	return worker
}

/**
 * Sets up the global and admin groups.
 */
async function setup() {
	console.log("Starting setup")

	const worker = await startJazzWorker()

	/*
	 * Create global group
	 */
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

	/*
	 * Create admin group
	 */
	// const user = (await await LaAccount.createAs(worker, {
	// 	creationProps: { name: "nikiv" }
	// }))!
	// const adminGlobalGroup = Group.create({ owner: worker })
	// adminGlobalGroup.addMember(user, "admin")
	// await appendFile("./.env", `\nJAZZ_ADMIN_GLOBAL_GROUP=${JSON.stringify(adminGlobalGroup.id)}`)

	console.log("Setup completed successfully", publicGlobalGroup.id)
}

/**
 * Loads the global group.
 * @returns A Promise that resolves to the loaded global group.
 * @throws Error if the global group fails to load.
 */
async function loadGlobalGroup() {
	const worker = await startJazzWorker()

	const globalGroupId = getEnvOrThrow("JAZZ_PUBLIC_GLOBAL_GROUP") as ID<PublicGlobalGroup>

	const globalGroup = await PublicGlobalGroup.load(globalGroupId, worker, {
		root: {
			topics: [{ latestGlobalGuide: { sections: [] } }],
			forceGraphs: [{ connections: [] }]
		}
	})

	if (!globalGroup) throw new Error("Failed to load global group")

	return globalGroup
}

/**
 * Processes JSON files to extract link and topic data.
 * @returns A Promise that resolves to a tuple containing a LinkManager and an array of TopicJson.
 */
async function processJsonFiles(): Promise<[LinkManager, TopicJson[]]> {
	const directory = path.join(__dirname, "..", "private", "data", "edgedb", "topics")

	const linkManager = new LinkManager()
	const processedData: TopicJson[] = []

	let files = await fs.readdir(directory)
	files.sort((a, b) => a.localeCompare(b)) // sort files alphabetically

	files = files.slice(0, 1) // get only 1 file for testing

	for (const file of files) {
		if (path.extname(file) === ".json") {
			const filePath = path.join(directory, file)
			try {
				const data = JSON.parse(await fs.readFile(filePath, "utf-8")) as TopicJson
				if (data.latestGlobalGuide) {
					for (const section of data.latestGlobalGuide.sections) {
						for (const link of section.links) {
							linkManager.addLink(link)
						}
					}
				}
				processedData.push(data)
			} catch (error) {
				console.error(`Error processing file ${file}:`, error)
			}
		}
	}

	return [linkManager, processedData]
}

/**
 * Creates a simple progress bar string.
 * @param progress - Current progress (0-100).
 * @param total - Total width of the progress bar.
 * @returns A string representing the progress bar.
 */
function createProgressBar(progress: number, total: number = 30): string {
	const filledWidth = Math.round((progress / 100) * total)
	const emptyWidth = total - filledWidth
	return `[${"=".repeat(filledWidth)}${" ".repeat(emptyWidth)}]`
}

/**
 * Updates the progress display in the terminal.
 * @param message - The message to display.
 * @param current - Current progress value.
 * @param total - Total progress value.
 */
function updateProgress(message: string, current: number, total: number) {
	const percentage = Math.round((current / total) * 100)
	const progressBar = createProgressBar(percentage)
	process.stdout.write(`\r${message} ${progressBar} ${percentage}% (${current}/${total})`)
}

async function insertLinksInBatch(links: LinkJson[], chunkSize: number = 100) {
	const globalGroup = await loadGlobalGroup()
	const allCreatedLinks: Link[] = []
	const totalLinks = links.length

	for (let i = 0; i < totalLinks; i += chunkSize) {
		const chunk = links.slice(i, i + chunkSize)
		const rows = chunk.map(link =>
			Link.create(
				{
					title: link.title,
					url: link.url
				},
				{ owner: globalGroup }
			)
		)
		allCreatedLinks.push(...rows)

		updateProgress("Processing links:", i + chunk.length, totalLinks)

		// Add a small delay between chunks to avoid overwhelming the system
		await new Promise(resolve => setTimeout(resolve, 1000))
	}

	console.log("\nFinished processing links")
	return allCreatedLinks
}

async function saveProcessedData(linkLists: Link[], topics: TopicJson[], chunkSize: number = 10) {
	const globalGroup = await loadGlobalGroup()
	const totalTopics = topics.length

	for (let i = 0; i < totalTopics; i += chunkSize) {
		const topicChunk = topics.slice(i, i + chunkSize)

		topicChunk.forEach(topic => {
			const topicModel = Topic.create(
				{
					name: topic.name,
					prettyName: topic.prettyName,
					latestGlobalGuide: LatestGlobalGuide.create(
						{
							sections: ListOfSections.create([], { owner: globalGroup })
						},
						{ owner: globalGroup }
					)
				},
				{ owner: globalGroup }
			)

			if (!topic.latestGlobalGuide) {
				console.error("No sections found in", topic.name)
				return
			}

			topic.latestGlobalGuide.sections.map(section => {
				const sectionModel = Section.create(
					{
						title: section.title,
						links: ListOfLinks.create([], { owner: globalGroup })
					},
					{ owner: globalGroup }
				)

				section.links.map(link => {
					const linkModel = linkLists.find(l => l.url === link.url)
					if (linkModel) {
						sectionModel.links?.push(linkModel)
					}
				})

				topicModel.latestGlobalGuide?.sections?.push(sectionModel)
			})

			globalGroup.root.topics?.push(topicModel)
		})

		updateProgress("Processing topics:", i + topicChunk.length, totalTopics)

		// Add a small delay between chunks to avoid overwhelming the system
		await new Promise(resolve => setTimeout(resolve, 1000))
	}

	console.log("\nFinished processing topics")
}

/**
 * Seeds production data.
 */
async function prodSeed() {
	console.log("Starting to seed data")

	const [linkManager, processedData] = await processJsonFiles()

	console.log(`Collected ${linkManager.getAllLinks().length} unique links.`)
	console.log(`Found ${linkManager.getDuplicateCount()} duplicate links.`)

	console.log("\nInserting links:")
	const insertedLinks = await insertLinksInBatch(linkManager.getAllLinks(), 100)

	console.log("\nSaving processed data:")
	await saveProcessedData(insertedLinks, processedData, 10)

	console.log("\nFinished seeding data")
}

interface ForceGraphJson {
	name: string
	prettyName: string
	connections: string[]
}

/**
 * Manages links, handling deduplication and tracking duplicates.
 */
class ConnectionManager {
	private connections: Map<string, string> = new Map()
	private duplicateCount: number = 0

	/**
	 * Adds a connection to the manager, tracking duplicates.
	 * @param connection - The connection to add.
	 */
	addConnection(connection: string) {
		if (this.connections.has(connection)) {
			this.duplicateCount++
		} else {
			this.connections.set(connection, connection)
		}
	}

	/**
	 * Gets all unique connections.
	 * @returns An array of unique connections.
	 */
	getAllConnections() {
		return Array.from(this.connections.values())
	}

	/**
	 * Gets the count of duplicate connections.
	 * @returns The number of duplicate connections.
	 */
	getDuplicateCount() {
		return this.duplicateCount
	}
}

/**
 * Inserts connections in batch.
 * @param connections - An array of string objects to insert.
 * @returns A Promise that resolves to an array of created Connection models.
 */
async function insertConnectionsInBatch(connections: string[]) {
	const globalGroup = await loadGlobalGroup()
	const rows = []

	for (const connection of connections) {
		const connectionModel = Connection.create(
			{
				name: connection
			},
			{ owner: globalGroup }
		)
		rows.push(connectionModel)
	}

	return rows
}

/**
 * Saves force graph data to the global group.
 * @param connectionLists - An array of Connection models.
 * @param forceGraphs - An array of ForceGraphJson objects.
 */
async function saveForceGraph(connectionLists: Connection[], forceGraphs: ForceGraphJson[]) {
	const globalGroup = await loadGlobalGroup()

	forceGraphs.map(forceGraph => {
		const forceGraphModel = ForceGraph.create(
			{
				name: forceGraph.name,
				prettyName: forceGraph.prettyName,
				connections: ListOfConnections.create([], { owner: globalGroup })
			},
			{ owner: globalGroup }
		)

		forceGraph.connections.map(connection => {
			const connectionModel = connectionLists.find(c => c.name === connection)
			if (connectionModel) {
				forceGraphModel.connections?.push(connectionModel)
			}
		})

		globalGroup.root.forceGraphs?.push(forceGraphModel)
	})
}

async function forceGraphSeed() {
	console.log("Starting to seed force graph data")

	const directory = path.join(__dirname, "..", "private", "data", "edgedb")

	const connectionManager = new ConnectionManager()
	const processedData: ForceGraphJson[] = []

	const files = await fs.readdir(directory)
	const file = files.find(file => file === "force-graphs.json")

	if (!file) {
		console.error("No force-graphs.json file found")
		return
	}

	const filePath = path.join(directory, file)

	try {
		const forceGraphs = JSON.parse(await fs.readFile(filePath, "utf-8")) as ForceGraphJson[]

		for (const forceGraph of forceGraphs) {
			if (forceGraph.connections.length) {
				for (const connection of forceGraph.connections) {
					connectionManager.addConnection(connection)
				}
			}

			processedData.push(forceGraph)
		}
	} catch (error) {
		console.error(`Error processing file ${file}:`, error)
	}

	console.log(`Collected ${connectionManager.getAllConnections().length} unique connections.`)
	console.log(`Found ${connectionManager.getDuplicateCount()} duplicate connections.`)

	const insertedConnections = await insertConnectionsInBatch(connectionManager.getAllConnections())
	await saveForceGraph(insertedConnections, processedData)

	// wait 3 seconds before finishing
	await new Promise(resolve => setTimeout(resolve, 3000))
	console.log("Finished seeding force graph data")
}

/**
 * Performs a full production rebuild.
 */
async function fullProdRebuild() {
	await prodSeed()
	await forceGraphSeed()
}

/**
 * Main seed function to handle different commands.
 */
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
			case "forceGraph":
				await forceGraphSeed()
				break
			default:
				console.log("Unknown command")
				break
		}
	} catch (err) {
		console.error("Error occurred:", err)
	}
}

await seed()
