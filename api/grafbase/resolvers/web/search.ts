import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { emailFromHankoToken } from "../../../../shared/auth"
import { webSearchAuth } from "../../../edgedb/crud/website"

const resolver: Resolver["Query.webSearch"] = async (
	parent,
	args,
	context,
	info,
) => {
	try {
		const email = await emailFromHankoToken(context)
		if (email) {
			const res = await webSearchAuth(email)
			return {
				auth: res,
			}
		} else {
			// const res = await indexRoutePublic()
			return {
				public: {
					empty: true,
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
