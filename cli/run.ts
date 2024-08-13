import { getEnvOrThrow } from "@/lib/utils"
import { PublicGlobalGroup } from "@/web/lib/schema/global-topic-graph"
import { startWorker } from "jazz-nodejs"
import { Group, ID } from "jazz-tools"

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
	const globalGroup = await (
		(await PublicGlobalGroup.load(process.env.JAZZ_PUBLIC_GLOBAL_GROUP as ID<Group>, worker, {})) as PublicGlobalGroup
	).ensureLoaded({ root: { topicGraph: [{ connectedTopics: [{}] }] } })
	if (!globalGroup) return // TODO: err

	console.log(
		globalGroup.root.topicGraph?.subscribe([], graph => {
			console.log(graph, "graph")
		}),
		"graph"
	)
}

await run()
