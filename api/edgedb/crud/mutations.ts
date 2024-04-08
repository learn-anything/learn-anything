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

export async function createOther() {
	const res = await e.insert(e.Other, {
		latestGlobalTopicGraph: {}
	}).run(client)
	return res
}

export async function updateLatestGlobalTopicGraph(topicGraph: string) {
	const res = await e
		.update(e.Other, () => ({
			set: {
				latestGlobalTopicGraph: topicGraph,
			},
		}))
		.run(client)
	return res
}
