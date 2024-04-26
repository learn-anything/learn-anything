import {
	createPersonalLink,
	createUser,
	deleteAllGlobalLinks,
	deleteAllPersonalLinks,
	deleteUser,
} from "../api/edgedb/crud/mutations.ts"

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
		console.log("done")
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
	await createPersonalLink(
		email,
		"https://learn-anything.xyz",
		"NoLearningStatus",
		"Learn Anything",
	)
	await createPersonalLink(
		email,
		"https://twitter.com/rasbt/status/1779894720291856492",
		"ToComplete",
		"Build an LLM from Scratch: Chapter 5",
	)
	// await updateUserBio(email, "Make learn-anything.xyz")
}

async function mobileIndex() {
	// await base()
	await deleteAllPersonalLinks()
	await deleteAllGlobalLinks()
	await createPersonalLink(
		email,
		"https://learn-anything.xyz",
		"NoLearningStatus",
		"Learn Anything",
		"Organize world's knowledge, explore connections and curate learning paths",
		"Check it out",
		true,
		2023,
	)
	await createPersonalLink(
		email,
		"https://twitter.com/rasbt/status/1779894720291856492",
		"ToComplete",
		"Build an LLM from Scratch: Chapter 5",
	)
}

function checkSeedDbConnection() {
	if (process.env.EDGEDB_DATABASE !== "seed") {
		throw new Error("Seed db connection not set")
	}
}

await seed()
