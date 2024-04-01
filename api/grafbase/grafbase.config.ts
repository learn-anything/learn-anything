import { config, graph } from "@grafbase/sdk"

const g = graph.Standalone()
export default config({
	graph: g,
	experimental: {
		kv: true,
		codegen: true,
	},
	auth: {
		rules: (rules) => {
			rules.public()
		},
	},
})

// -- definitions
const LearningStatus = g.enum("LearningStatus", ["Learn", "Learning", "Learned"])
// const LearningStatusNullable = g.enum("learningStatus", ["Learn", "Learning", "Learned", "None"])
const FilterOrder = g.enum("FilterOrder", ["custom", "recently_added", "none"])
const Filter = g.enum("filter", ["liked", "topic", "none"])
const Link = g.type("Link", {
	title: g.string(),
	url: g.string(),
})
// const User = g.type("User", {
// 	username: g.string(),
// })
const EditingLink = g.type("EditingLink", {
	title: g.string(),
	url: g.string(),
	description: g.string().optional(),
	status: g.enumRef(LearningStatus),
	topic: g.string().optional(),
	note: g.string().optional(),
	year: g.int().optional(),
	addedAt: g.string().optional(),
})

const webIndexReturnPublic = g.type("webIndexReturnPublic", {
	username: g.string(),
	links: g.ref(Link).list(),
	// showLinksStatus: g.enumRef(LearningStatus),
	// filterOrder: g.enumRef(FilterOrder),
	// filter: g.enumRef(Filter),
	// filterTopic: g.string().optional(),
	// userTopics: g.string().list(),
	// editingLink: g.ref(EditingLink).optional(),
	// linkToEdit: g.string().optional(),
	// searchQuery: g.string().optional(),
})
const webIndexReturnAuth = g.type("webIndexReturnAuth", {
	topics: g.string().list(),
})

// -- website queries
// / = landing page
g.query("webIndex", {
	args: {},
	returns: g.ref(
		g.type("webIndexOutput", {
			public: g.ref(webIndexReturnPublic).optional(),
			auth: g.ref(webIndexReturnAuth).optional(),
		}),
	),
	resolver: "web/index",
})

// -- mutations (return `true` on success, throw error on failure)
g.mutation("createUser", {
	args: {
		email: g.string(),
	},
	returns: g.boolean(),
	resolver: "mutations/createUser",
})
g.mutation("updatePersonalLink", {
	args: {
		linkId: g.string(),
		status: g.enumRef(LearningStatus),
	},
	returns: g.boolean(),
	resolver: "mutations/updatePersonalLink",
})
