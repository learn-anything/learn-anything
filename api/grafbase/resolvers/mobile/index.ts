import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"

// @ts-ignore
const resolver: Resolver["Query.mobileIndex"] = async (parent, args, context, info) => {
	try {
		return {
			auth: {
				filterStatus: "learning",
			},
		}
	} catch (err) {
		console.error(err)
		throw new GraphQLError(JSON.stringify(err))
	}
}

export default resolver
