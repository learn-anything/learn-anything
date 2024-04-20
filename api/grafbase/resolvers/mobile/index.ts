import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { emailFromHankoToken } from "../../../../shared/auth"
import { indexMobile } from "../../../edgedb/crud/mobile"

const resolver: Resolver["Query.mobileIndex"] = async (
	parent,
	args,
	context,
	info,
) => {
	try {
		const email = await emailFromHankoToken(context)
		if (email) {
			const res = await indexMobile(email)
			console.log(res, "res")
			return res
			// return {
			// 	// user: {
			// 	// 	email: "github@nikiv.dev",
			// 	// 	name: "Nikita",
			// 	// },
			// 	personalLinks: [
			// 		{
			// 			id: "1",
			// 			url: "https://solidjs.com",
			// 			title: "Modern JavaScript Tutorial",
			// 			topic: "Solid",
			// 		},
			// 	],
			// 	// showLinksStatus: "Learning",
			// 	// filterOrder: "Custom",
			// 	// filter: "None",
			// 	// userTopics: ["Solid", "GraphQL", "Figma"],
			// }
		} else {
			throw new GraphQLError("No email found from token")
		}
	} catch (err) {
		console.error(err)
		throw new GraphQLError(JSON.stringify(err))
	}
}

export default resolver
