import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { emailFromHankoToken } from "../../../../shared/auth"
import e from "../../../edgedb/dbschema/edgeql-js"
import { client } from "../../../edgedb/client"

const resolver: Resolver["Query.localTest"] = async (
	parent,
	args,
	context,
	info,
) => {
	try {
		const email = await emailFromHankoToken(context)
		if (email) {
			const res = await e
				.select(e.User, (user) => ({
					bio: true,
					filter_single: e.op(user.email, "=", email),
				}))
				.run(client)
			return {
				auth: res,
			}
		} else {
			return {
				public: {
					message: "Test",
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
