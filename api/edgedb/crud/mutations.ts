import { foundOtherObjectId } from "../../../shared/edgedb"
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

export async function updateUserBio(email: string, bio: string) {
	return await e
		.update(e.User, () => ({
			filter_single: { email: email! },
			set: {
				bio: bio,
			},
		}))
		.run(client)
}

export async function deleteUser(email: string) {
	return await e
		.delete(e.User, (user) => ({
			filter: e.op(user.email, "=", email),
		}))
		.run(client)
}

export async function createOther() {
	return await e
		.insert(e.Other, {
			latestGlobalTopicGraph: e.insert(e.GlobalTopicGraph, {
				name: "test",
			}),
		})
		.run(client)
}

type TopicGraph = {
	name: string
	prettyName: string
	connections: string[]
}
export async function updateLatestGlobalTopicGraph(topicGraph: TopicGraph) {
	return e
		.update(e.GlobalTopicGraph, (tg) => ({
			set: {
				name: topicGraph.name,
				prettyName: topicGraph.prettyName,
				connections: topicGraph.connections,
			},
			filter_single: e.op(
				tg["<latestGlobalTopicGraph[is Other]"].id,
				"=",
				foundOtherObjectId(),
			),
		}))
		.run(client)
}
