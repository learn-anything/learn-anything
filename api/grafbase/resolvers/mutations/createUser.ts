import { GraphQLError } from "graphql"
import { Resolver } from "@grafbase/generated"
import { createUser } from "../../../edgedb/crud/mutations"

const resolver: Resolver["Mutation.createUser"] = async (parent, args, context, info) => {
	try {
		const res = await createUser(args.email)
		if (res) {
			return true
		} else {
			throw new GraphQLError("Failed to create user")
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
