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

export const get = api(
	{ expose: true, method: "GET", path: "/global-link-details/:url" },
	async ({
		url
	}: {
		url: string
	}): Promise<{
		title: string
		summary?: string
	}> => {
		// const { worker } = await startWorker({
		// 	accountID: "co_zhvp7ryXJzDvQagX61F6RCZFJB9",
		// 	accountSecret: JAZZ_WORKER_SECRET
		// })

		return {
			title: "Jazz",
			summary: "Jazz is local first framework for building web apps"
		}
	}
)
