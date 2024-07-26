import { getEnvOrThrow } from "@/lib/utils"

async function run() {
	try {
		const OPENAI_API_KEY = getEnvOrThrow("OPENAI_API_KEY")
		console.log(OPENAI_API_KEY)
	} catch (err) {
		console.log(err, "err")
	}
}

// @ts-ignore
await run()
// past:
