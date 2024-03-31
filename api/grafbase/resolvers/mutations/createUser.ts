import { GraphQLError } from "graphql"
import { Resolver } from "@grafbase/generated"
import { createUser } from "../../../edgedb/crud/user"

// @ts-ignore
const resolver: Resolver["Mutation.createUser"] = async (parent, args, context, info) => {
	try {
		console.log("running resolver")
		const res = await createUser(args.email)
		console.log(res, "res")
		// TODO: check error
		if (res) {
			return true
		} else {
			return false
		}
	} catch (err) {
		console.error(err)
		throw new GraphQLError(JSON.stringify(err))
	}
}

export default resolver
