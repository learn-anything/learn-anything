import { client } from "../client"
import e from "../dbschema/edgeql-js"

export async function createUser(email: string) {
	const res = await e
		.insert(e.User, {
			email: email,
		})
		.run(client)
	return res.id
}

export async function deleteUser(email: string) {
	const res = await e
		.delete(e.User, (user) => ({
			filter: e.op(user.email, "=", email),
		}))
		.run(client)
	return res
}
