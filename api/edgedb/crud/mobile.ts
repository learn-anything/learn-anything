import { client } from "../client"
import e from "../dbschema/edgeql-js"

export async function indexMobile(email: string) {
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
			filter_single: e.op(user.email, "=", email),
		}))
		.run(client)
}
