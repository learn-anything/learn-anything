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
}

/**
 * Loads the global group.
 * @returns A Promise that resolves to the loaded global group.
 * @throws Error if the global group fails to load.
 */
async function loadGlobalGroup() {
	const worker = await startJazzWorker()

	const globalGroupId = process.env.JAZZ_PUBLIC_GLOBAL_GROUP as ID<PublicGlobalGroup>
	const globalGroup = await PublicGlobalGroup.load(globalGroupId, worker, {
		root: {
			topics: [{ latestGlobalGuide: { sections: [] } }]
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
 * Inserts links in batch.
 * @param links - An array of LinkJson objects to insert.
 * @returns A Promise that resolves to an array of created Link models.
 */
async function insertLinksInBatch(links: LinkJson[]) {
	const globalGroup = await loadGlobalGroup()
	const rows = []

	for (const link of links) {
		const linkModel = Link.create(
			{
				title: link.title,
				url: link.url
			},
			{ owner: globalGroup }
		)
		rows.push(linkModel)
	}

	return rows
}

/**
 * Saves processed data (topics and links) to the global group.
 * @param linkLists - An array of Link models.
 * @param topics - An array of TopicJson objects.
 */
async function saveProcessedData(linkLists: Link[], topics: TopicJson[]) {
	const globalGroup = await loadGlobalGroup()

	topics.map(topic => {
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
					console.log("link found", linkModel)
					sectionModel.links?.push(linkModel)
				}
			})

			topicModel.latestGlobalGuide?.sections?.push(sectionModel)
		})

		globalGroup.root.topics?.push(topicModel)
	})
}

/**
 * Seeds production data.
 */
async function prodSeed() {
	console.log("Starting to seed data")

	const [linkManager, processedData] = await processJsonFiles()

	console.log(`Collected ${linkManager.getAllLinks().length} unique links.`)
	console.log(`Found ${linkManager.getDuplicateCount()} duplicate links.`)

	const insertedLinks = await insertLinksInBatch(linkManager.getAllLinks())
	await saveProcessedData(insertedLinks, processedData)

	console.log("Finished seeding data")
}

/**
 * Performs a full production rebuild.
 */
async function fullProdRebuild() {
	await setup()
	await prodSeed()
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
			default:
				console.log("Unknown command")
				break
		}
		console.log("done")
	} catch (err) {
		console.error("Error occurred:", err)
	}
}

await seed()
