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
			return {
				auth: {
					res,
				},
			}
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

// TODO: move to grafbase config
type ProfileDataForAuthenticatedPage = {
	links: { title: string; url: string }[]
	showLinksStatus: "Learning" | "To Learn" | "Learned"
	filterOrder: "Custom" | "RecentlyAdded"
	filter: "Liked" | "None" | "Topic"
	filterTopic?: string // used when filter is set to "Topic"
	userTopics: string[]
	user: {
		email: string
		name: string
	}
	editingLink?: {
		title: string
		url: string
		description?: string
		status?: "Learning" | "To Learn" | "Learned"
		topic?: string
		note?: string
		year?: number
		addedAt?: string
	}
	linkToEdit?: string // TODO: id of link? how to know what link is opened for editing
	searchQuery?: string // what is typed in the search input on bottom
}
