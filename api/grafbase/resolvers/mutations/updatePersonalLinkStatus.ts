import { GraphQLError } from "graphql"
import { Resolver } from "@grafbase/generated"
import { emailFromHankoToken } from "../../../../shared/auth"

// @ts-ignore
const resolver: Resolver["Mutation.updatePersonalLink"] = async (parent, args, context, info) => {
	try {
		const email = await emailFromHankoToken(context)
		if (email) {
			// const user = await getUser(email)
			return true
		} else {
			throw new GraphQLError("Missing or invalid Authorization header")
		}
	} catch (err) {
		console.error(err)
		throw new GraphQLError(JSON.stringify(err))
	}
	// try {
	// 	const hankoId = await hankoIdFromToken(context)
	// 	if (hankoId) {
	// 		if (args.action === "like" || args.action === "unlike") {
	// 			const res = await likeOrUnlikeGlobalLink(hankoId, args.personalLinkId, args.action)
	// 			if (res === null) {
	// 				throw new GraphQLError("cannot-update-global-link-status")
	// 			}
	// 			return "ok"
	// 		}
	// 		const res = await updateGlobalLinkProgress(hankoId, args.personalLinkId, args.action)
	// 		if (res === null) {
	// 			throw new GraphQLError("cannot-update-global-link-status")
	// 		}
	// 		return "ok"
	// 	} else {
	// 		throw new GraphQLError("Missing or invalid Authorization header")
	// 	}
	// } catch (err) {
	// 	console.error(err)
	// 	throw new GraphQLError(JSON.stringify(err))
	// }
}

export default resolver
