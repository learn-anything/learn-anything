import { client } from "../client"
import e from "../dbschema/edgeql-js"

export async function getUser(email: string) {
	const res = await e
		.select(e.User, (user) => ({
			username: true,
			filter_single: e.op(user.email, "=", email),
		}))
		.run(client)
	return res
}
