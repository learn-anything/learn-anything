import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { emailFromHankoToken } from "../../../../shared/auth"
import { indexRouteAuth, indexRoutePublic } from "../../../edgedb/crud/website"

const resolver: Resolver["Query.webIndex"] = async (
	parent,
	args,
	context,
	info,
) => {
	try {
		const email = await emailFromHankoToken(context)
		if (email) {
			const res = await indexRouteAuth(email)
			return {
				auth: res,
			}
		} else {
			const res = await indexRoutePublic()
			return {
				public: {
					latestGlobalTopicGraph: res,
				},
			}
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
