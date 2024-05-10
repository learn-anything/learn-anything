import { query$ } from "@solid-mediakit/prpc"
import { client } from "../../api/edgedb/client"
import { indexPublic } from "../../api/edgedb/crud/queries"
// import { auth } from "@/edgedb-next-client"

export const indexPublicQuery = query$({
	queryFn: async ({ payload, event$ }) => {
		// const session = auth.getSession()
		// const client = session.client
		// const authenticated = await session.isSignedIn()
		// return await indexPublic.run(client)
	},
	key: "indexPublicQuery",
})
