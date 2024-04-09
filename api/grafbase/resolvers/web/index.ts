import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { emailFromHankoToken } from "../../../../shared/auth"
import {
	indexRouteAuth,
	indexRoutePublic,
} from "../../../edgedb/crud/routes/website"

const resolver: Resolver["Query.webIndex"] = async (
	parent,
	args,
	context,
	info,
) => {
	try {
		// const email = await emailFromHankoToken(context)
		const email = "nikita@nikiv.dev"
		if (email) {
			const res = await indexRouteAuth(email)
			console.log(res, "auth res")
			return {
				auth: {
					username: "nikiv",
				},
			}
		} else {
			const res = await indexRoutePublic()
			console.log(res, "public res")
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
