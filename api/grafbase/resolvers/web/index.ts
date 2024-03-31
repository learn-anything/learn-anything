import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { emailFromHankoToken } from "../../../../shared/auth"
import { indexRoute, indexRouteAuth } from "../../../edgedb/crud/routes/website"

// @ts-ignore
const resolver: Resolver["Query.webIndex"] = async (parent, args, context, info) => {
	try {
		const email = await emailFromHankoToken(context)
		if (email) {
			const res = await indexRouteAuth(email)
			console.log(res)
			// return {
			// 	user: {
			// 		...user,
			// 	},
			// }
		} else {
			// TODO: non authorised, return data to render landing page (topics + graph)
			const res = await indexRoute()
			console.log(res)
		}
	} catch (err) {
		console.error(err)
		throw new GraphQLError(JSON.stringify(err))
	}
}

export default resolver
