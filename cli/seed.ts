async function seed() {
	const args = Bun.argv
	const command = args[2]
	try {
		switch (command) {
			case undefined:
				console.log("No command provided")
				break
			default:
				console.log("Unknown command")
				break
		}
		console.log("done")
	} catch (err) {
		console.error("Error:", err)
	}
}
