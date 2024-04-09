import { GraphQLError } from "graphql"
import { Resolver } from "@grafbase/generated"
import { createUser, updateUserBio } from "../../../edgedb/crud/mutations"
import { emailFromHankoToken } from "../../../../shared/auth"

const resolver: Resolver["Mutation.updateUserBio"] = async (
	parent,
	args,
	context,
	info,
) => {
	try {
		const email = await emailFromHankoToken(context)
		const res = await updateUserBio(email, args.bio)
		if (res) {
			return true
		} else {
			throw new GraphQLError("Failed to update user bio")
		}
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message, "error")
			throw new GraphQLError(err.message)
		}
		throw new GraphQLError(JSON.stringify(err))
	}
}

export default resolver
