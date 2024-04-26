// all functions here start with either: create, update, delete
import { splitUrlByProtocol } from "@nikiv/utils"
import { foundUserByEmail } from "../../../shared/edgedb"
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

export async function updateUserUsername(email: string, username: string) {
	return await e
		.update(e.User, () => ({
			filter_single: { email: email! },
			set: {
				username: username,
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

export async function createPersonalLink(
	email: string,
	url: string,
	learningStatus:
		| "ToComplete"
		| "InProgress"
		| "Completed"
		| "NoLearningStatus",
	title?: string,
	description?: string,
	note?: string,
	liked?: boolean,
	year?: number,
	// TODO: should probably be datetime
	dateAdded?: string,
) {
	const foundUser = foundUserByEmail(email)

	const [urlWithoutProtocol, protocol] = splitUrlByProtocol(url)
	if (urlWithoutProtocol && protocol) {
		const globalLink = await e
			.insert(e.GlobalLink, {
				url: urlWithoutProtocol,
				protocol: protocol,
				...(title && { title }),
			})
			.unlessConflict((gl) => ({
				on: gl.url,
				else: gl,
			}))

		switch (learningStatus) {
			case "NoLearningStatus":
				return e
					.update(foundUser, () => ({
						set: {
							linksWithoutLearningStatus: e.insert(e.PersonalLink, {
								globalLink,
								...(title && { title }),
								...(description && { description }),
								...(note && { note }),
								...(year && { year }),
							}),
						},
					}))
					.run(client)
			case "ToComplete":
				return e
					.update(foundUser, () => ({
						set: {
							linksCompleted: e.insert(e.PersonalLink, {
								globalLink,
								...(title && { title }),
								...(description && { description }),
								...(note && { note }),
								...(year && { year }),
							}),
						},
					}))
					.run(client)
			case "InProgress":
				return e
					.update(foundUser, () => ({
						set: {
							linksInProgress: e.insert(e.PersonalLink, {
								globalLink,
								...(title && { title }),
								...(description && { description }),
								...(note && { note }),
								...(year && { year }),
							}),
						},
					}))
					.run(client)
			case "Completed":
				return e
					.update(foundUser, () => ({
						set: {
							linksCompleted: e.insert(e.PersonalLink, {
								globalLink,
								...(title && { title }),
								...(description && { description }),
								...(note && { note }),
								...(year && { year }),
							}),
						},
					}))
					.run(client)
			default:
				break
		}
	}
}
export async function deleteAllPersonalLinks() {
	return await e.delete(e.PersonalLink).run(client)
}
export async function deleteAllGlobalLinks() {
	return await e.delete(e.GlobalLink).run(client)
}

// -- past (non working)
// export async function createOther() {
// 	return await e
// 		.insert(e.Other, {
// 			latestGlobalTopicGraph: e.insert(e.GlobalTopicGraph, {
// 				name: "test",
// 			}),
// 		})
// 		.run(client)
// }
// type TopicGraph = {
// 	name: string
// 	prettyName: string
// 	connections: string[]
// }
// export async function updateLatestGlobalTopicGraph(topicGraph: TopicGraph) {
// 	return e
// 		.update(e.GlobalTopicGraph, (tg) => ({
// 			set: {
// 				name: topicGraph.name,
// 				prettyName: topicGraph.prettyName,
// 				connections: topicGraph.connections,
// 			},
// 			filter_single: e.op(
// 				tg["<latestGlobalTopicGraph[is Other]"].id,
// 				"=",
// 				foundOtherObjectId(),
// 			),
// 		}))
// 		.run(client)
// }
