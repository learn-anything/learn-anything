import { getEnvOrThrow } from "@/lib/utils"
import { PublicGlobalGroup } from "@/web/lib/schema/master/public-group"
import { startWorker } from "jazz-nodejs"
import { ID } from "jazz-tools"

const JAZZ_WORKER_SECRET = getEnvOrThrow("JAZZ_WORKER_SECRET")

async function run() {
	try {
		await readJazz()
	} catch (err) {
		console.log(err, "err")
	}
}

async function readJazz() {
	const { worker } = await startWorker({
		accountID: "co_zhvp7ryXJzDvQagX61F6RCZFJB9",
		accountSecret: JAZZ_WORKER_SECRET
	})

	const globalGroupId = process.env.JAZZ_PUBLIC_GLOBAL_GROUP as ID<PublicGlobalGroup>
	const globalGroup = await PublicGlobalGroup.load(globalGroupId, worker, {
		root: {
			topics: [
				{
					latestGlobalGuide: {
						sections: [
							{
								links: [{}]
							}
						]
					}
				}
			],
			forceGraphs: [
				{
					connections: [{}]
				}
			]
		}
	})

	if (!globalGroup) return // TODO: err

	// wait 10 seconds
	await new Promise(resolve => setTimeout(resolve, 10000))

	/*
	 * Log forceGraphs
	 */
	const asJsonForceGraphs = globalGroup.root.forceGraphs.map(node => {
		console.log({ node }, "node")
		return {
			name: node.name,
			prettyName: node.prettyName,
			connections: node.connections?.map(connection => {
				return {
					name: connection?.name
				}
			})
		}
	})

	const asJson = globalGroup.root.topics?.map(node => {
		return {
			name: node.name,
			prettyName: node.prettyName,
			latestGlobalGuide: {
				sections: node.latestGlobalGuide.sections.map(section => {
					return {
						title: section?.title,
						links: section?.links?.map(link => {
							return {
								title: link?.title,
								url: link?.url
							}
						})
					}
				})
			}
		}
	})

	console.log({ asJsonForceGraphs }, "asJsonForceGraphs")
	console.log({ asJson }, "asJson")
}

await run()
