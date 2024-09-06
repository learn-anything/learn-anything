// TODO: not sure if `links` should be separate service
// it is responsible for adding and getting links into LA from API

import { api, APIError } from "encore.dev/api"
import { startWorker } from "jazz-nodejs"

const JAZZ_WORKER_SECRET = process.env.JAZZ_WORKER_SECRET

export const addPersonalLink = api(
	{ expose: true, method: "POST", path: "/save-link" },
	async ({
		url
	}: {
		url: string
	}): Promise<{
		// TODO: prob not right
		ok: boolean
	}> => {
		const { worker } = await startWorker({
			accountID: "co_zhvp7ryXJzDvQagX61F6RCZFJB9",
			accountSecret: JAZZ_WORKER_SECRET
		})

		return {
			ok: true
		}
	}
)
