import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { getUser } from "../../../edgedb/crud/user"
import { emailFromHankoToken } from "../../../../shared/auth"

// @ts-ignore
const resolver: Resolver["Query.webIndex"] = async (parent, args, context, info) => {
	try {
		const email = await emailFromHankoToken(context)
		if (email) {
			const user = await getUser(email)
			return {
				user: {
					...user,
				},
			}
		} else {
			// TODO: non authorised, return data to render landing page (topics + graph)
		}
	} catch (err) {
		console.error(err)
		throw new GraphQLError(JSON.stringify(err))
	}
}

export default resolver
