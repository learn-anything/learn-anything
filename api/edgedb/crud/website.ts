import { client } from "../client"
import e from "../dbschema/edgeql-js"

export async function indexRoutePublic() {
	return await e
		.select(e.GlobalTopicGraph, () => ({
			name: true,
			prettyName: true,
			connections: true,
		}))
		.run(client)
}

export async function indexRouteAuth(email: string) {
	return await e
		.select(e.User, (user) => ({
			links: e.select(e.PersonalLink, (pl) => ({
				title: pl.title,
				url: pl.globalLink.url,
				description: pl.description,
				note: pl.note,
			})),
			personalPages: {
				title: true,
				pageUrl: true,
			},
			username: true,
			bio: true,
			filter_single: e.op(user.email, "=", email),
		}))
		.run(client)
}
