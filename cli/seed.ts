import { getEnvOrThrow } from "@/lib/utils"
import { LaAccount } from "@/web/lib/schema"
import { startWorker } from "jazz-nodejs"
import { Group, ID } from "jazz-tools"
import { appendFile } from "node:fs/promises"
import path from "path"
import fs from "fs/promises"

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
				console.log(content)
			}
		}
	}
}

await seed()
