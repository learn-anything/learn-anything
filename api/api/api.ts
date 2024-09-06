import { api, APIError } from "encore.dev/api"
import { startWorker } from "jazz-nodejs"
import { ID } from "jazz-tools"

const JAZZ_WORKER_ACCOUNT_ID = process.env.JAZZ_WORKER_ACCOUNT_ID
const JAZZ_WORKER_SECRET = process.env.JAZZ_WORKER_SECRET
const JAZZ_PUBLIC_GLOBAL_GROUP = process.env.JAZZ_PUBLIC_GLOBAL_GROUP

// return all content for GlobalTopic
export const getTopic = api(
	{ expose: true, method: "GET", path: "/topic/:topic" },
	async ({
		topic
	}: {
		topic: string
		// TODO: can return type be inferred like Elysia?
	}): Promise<{
		links: {
			label: string
			url: string
		}[]
	}> => {
		const { worker } = await startWorker({
			accountID: "co_zhvp7ryXJzDvQagX61F6RCZFJB9",
			accountSecret: JAZZ_WORKER_SECRET
		})

		// TODO: how to get the import from outside this package?
		// const globalGroupId = process.env.JAZZ_PUBLIC_GLOBAL_GROUP as ID<any>
		// const globalGroup = await PublicGlobalGroup.load(globalGroupId, worker, {
		// 	root: {
		// 		topics: [
		// 			{
		// 				latestGlobalGuide: {
		// 					sections: [
		// 						{
		// 							links: [{}]
		// 						}
		// 					]
		// 				}
		// 			}
		// 		],
		// 		forceGraphs: [
		// 			{
		// 				connections: [{}]
		// 			}
		// 		]
		// 	}
		// })
		// if (!globalGroup) throw APIError.notFound("GlobalGroup not found")

		// const globalGroupId = process.env.JAZZ_PUBLIC_GLOBAL_GROUP as ID<any>
		// console.log(globalGroupId)
		// console.log(worker)
		// console.log("runs..")

		const topicContent = {
			links: []
		}
		return topicContent
	}
)
