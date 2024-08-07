import { getEnvOrThrow } from "@/lib/utils"
import { LaAccount } from "@/web/lib/schema"
import { startWorker } from "jazz-nodejs"
import { Group, ID } from "jazz-tools"
import { appendFile } from "node:fs/promises"

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
	const publicGlobalGroup = Group.create({ owner: worker })
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
	const globalGroup = await Group.load(process.env.JAZZ_PUBLIC_GLOBAL_GROUP as ID<Group>, worker, {})
	if (!globalGroup) return // TODO: err
	// TODO: complete full seed (connections, topics from old LA)

	// const globalLink = GlobalLink.create(
	// 	{
	// 		url: "https://google.com",
	// 		urlTitle: "Google",
	// 		protocol: "https"
	// 	},
	// 	{ owner: globalGroup }
	// )
	// const user = (await (
	// 	await LaAccount.createAs(worker, {
	// 		creationProps: { name: "nikiv" }
	// 	})
	// ).ensureLoaded({ root: { personalLinks: [], pages: [], todos: [] } }))!
	// console.log(process.env.JAZZ_GLOBAL_GROUP!, "group")
	// console.log(worker)
	// TODO: type err
	// console.log(globalGroup, "group")
	// return
	// const currentFilePath = import.meta.path
	// const connectionsFilePath = `${currentFilePath.replace("seed.ts", "/seed/connections.json")}`
	// const file = Bun.file(connectionsFilePath)
	// const fileContent = await file.text()
	// const topicsWithConnections = JSON.parse(fileContent)
	// // let topicsWithConnections = JSON.stringify(obj, null, 2)
	// console.log(topicsWithConnections)
	// TODO: type err
	// topicsWithConnections.map(topic => {
	// 	const globalTopic = GlobalTopic.create({ name: topic.name, description: topic.description }, { owner: globalGroup })
	// })
}
await seed()
