import { client } from "../../client"
import e from "../../dbschema/edgeql-js"

export async function indexRoute() {
	const res = await e
		.select(e.User, (user) => ({
			username: true,
			// topics:
		}))
		.run(client)
	return res
}

export async function indexRouteAuth(email: string) {
	const res = await e
		.select(e.User, (user) => ({
			username: true,
			links: e.select(e.PersonalLink, (pl) => ({
				title: pl.title,
				url: pl.globalLink.url,
			})),
			filter_single: e.op(user.email, "=", email),
		}))
		.run(client)
	return res
}
