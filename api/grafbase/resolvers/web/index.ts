import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { indexRouteAuth, indexRoutePublic } from "../../../edgedb/crud/routes/website"

const resolver: Resolver["Query.webIndex"] = async (parent, args, context, info) => {
	try {
		// const email = await emailFromHankoToken(context)
		const email = "wow"
		if (email) {
			const res = await indexRouteAuth(email)
			console.log(res)
			return {
				auth: {
					username: "nikiv",
				},
			}
		} else {
			const res = await indexRoutePublic()
			console.log(res)
			return {
				public: {
					topics: ["test"],
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
