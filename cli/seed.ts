async function seed() {
	const args = Bun.argv
	const command = args[2]
	try {
		switch (command) {
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

async function webIndex() {
	// clear first
	console.log("test")
}

async function mobileIndex() {
	// clear first
}

await seed()
