import { getEnvOrThrow } from "@/lib/utils"
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
	const globalGroup = await Group.load(process.env.JAZZ_PUBLIC_GLOBAL_GROUP as ID<Group>, worker, {})
	if (!globalGroup) return // TODO: err

	const globalTopicGraph = globalGroup.toJSON()
	console.log(globalTopicGraph)
}

await run()
