import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"

const resolver: Resolver["Query.mobileIndex"] = async (
	parent,
	args,
	context,
	info,
) => {
	try {
		return {
			showLinksStatus: "Learning",
			user: {
				email: "github@nikiv.dev",
				name: "Nikita",
			},
			// links: [
			// 	{
			// 		id: "1",
			// 		url: "https://solidjs.com",
			// 		title: "Modern JavaScript Tutorial",
			// 		topic: "Solid",
			// 	},
			// ],
			filterOrder: "Custom",
			filter: "None",
			userTopics: ["Solid", "GraphQL", "Figma"],
		}
	} catch (err) {
		console.error(err)
		throw new GraphQLError(JSON.stringify(err))
	}
}

export default resolver
