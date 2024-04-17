import {
	createPersonalLink,
	createUser,
	deleteAllGlobalLinks,
	deleteAllPersonalLinks,
	deleteUser,
} from "../api/edgedb/crud/mutations"

const email = process.env.email!

async function seed() {
	checkSeedDbConnection()
	const args = Bun.argv
	const command = args[2]
	try {
		switch (command) {
			case "base":
				await base()
				break
			case "webIndex":
				await webIndex()
				break
			case "mobileIndex":
				await mobileIndex()
				break
			case undefined:
				console.log("No command provided")
				break
			default:
				console.log("Unknown command")
				break
		}
	} catch (err) {
		console.error("Error occurred:", err)
	}
}

async function base() {
	await deleteUser(email)
	await createUser(process.env.email!)
}

async function webIndex() {
	// await base()
	await deleteAllPersonalLinks()
	await deleteAllGlobalLinks()
	const res = await createPersonalLink(
		email,
		"https://learn-anything.xyz",
		"NoLearningStatus",
	)
	console.log(res, "res")
}

async function mobileIndex() {
	await base()
}

function checkSeedDbConnection() {
	if (process.env.EDGEDB_DATABASE !== "seed") {
		throw new Error("Seed db connection not set")
	}
}

await seed()
