import { client } from "../client"
import e from "../dbschema/edgeql-js"

export async function indexMobile(email: string) {
	return await e
		.select(e.User, (user) => ({
			personalLinks: e.select(e.PersonalLink, (pl) => ({
				id: true,
				url: pl.globalLink.url,
				title: pl.title,
				description: pl.description,
				year: pl.year,
				note: pl.note,
			})),
			filter_single: e.op(user.email, "=", email),
		}))
		.run(client)
}
