import { createUser, deleteUser } from "../api/edgedb/crud/mutations"

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
	const res = await createUser(process.env.email!)
	console.log(res, "res")
}

async function webIndex() {
	// clear first
	console.log("test")
}

async function mobileIndex() {
	// clear first
}

function checkSeedDbConnection() {
	if (process.env.EDGEDB_DATABASE !== "seed") {
		throw new Error("Seed db connection not set")
	}
}

await seed()
