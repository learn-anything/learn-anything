import { getEnvOrThrow } from "@/lib/utils"
import { PublicGlobalGroup } from "@/web/lib/schema/global-topic-graph"
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
		root: { topicGraph: [{ connections: [{}] }] }
	})

	if (!globalGroup) return // TODO: err

	const asJson = globalGroup.root.topicGraph?.map(node => {
		const connections = node.connections?.map(connection => {
			return connection?.name
		})
		return {
			name: node.name,
			prettyName: node.prettyName,
			connections
		}
	})
	console.log({ asJson })
}

await run()
