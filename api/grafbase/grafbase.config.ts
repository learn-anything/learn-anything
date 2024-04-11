import { config, graph } from "@grafbase/sdk"
import { define } from "@grafbase/sdk"

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

// useful to write shorter resolvers, won't work if you split config into multiple files: https://discord.com/channels/890534438151274507/1224299258686214144/1224322448837836861
type TypeArguments = Parameters<typeof define.type>
let count = 0
const inline = (fields: TypeArguments[1]) =>
	g.ref(g.type(`Inline${count++}`, fields))

// -- definitions
const Link = g.type("Link", {
	title: g.string().optional(),
	url: g.string().optional(),
})
const LearningStatus = g.enum("LearningStatus", [
	"Learn",
	"Learning",
	"Learned",
])
// const LearningStatusNullable = g.enum("learningStatus", ["Learn", "Learning", "Learned", "None"])
// const FilterOrder = g.enum("FilterOrder", ["custom", "recently_added", "none"])
// const Filter = g.enum("filter", ["liked", "topic", "none"])
// const EditingLink = g.type("EditingLink", {
// 	title: g.string(),
// 	url: g.string(),
// 	description: g.string().optional(),
// 	status: g.enumRef(LearningStatus),
// 	topic: g.string().optional(),
// 	note: g.string().optional(),
// 	year: g.int().optional(),
// 	addedAt: g.string().optional(),
// })

// -- website queries
// / = landing page
g.query("webIndex", {
	args: {},
	returns: inline({
		public: inline({
			latestGlobalTopicGraph: inline({
				name: g.string(),
				prettyName: g.string(),
				connections: g.string().list(),
			}).list(),
		}).optional(),
		auth: inline({
			username: g.string().optional(),
			bio: g.string().optional(),
			links: g.ref(Link).list(),
		}).optional(),
	}),
	resolver: "web/index",
})

// -- mobile queries
// / = home feed (list of links)
g.query("mobileIndex", {
	args: {},
	returns: inline({
		showLinksStatus: g.string(),
		user: inline({
			email: g.string(),
			name: g.string(),
		}).optional(),
		links: inline({
			id: g.string().optional(),
			url: g.string().optional(),
			title: g.string().optional(),
			topic: g.string().optional(),
		}).list(),
		filterOrder: g.string(),
		filter: g.string(),
		userTopics: g.string().list(),
		userTest: g.ref(
			g.type("User", {
				email: g.string(),
				name: g.string(),
			}),
		),
	}),
	resolver: "mobile/index",
})

// -- mutations (return `true` on success, throw error on failure)
g.mutation("createUser", {
	args: {
		email: g.string(),
	},
	returns: g.boolean(),
	resolver: "mutations/createUser",
})
g.mutation("updateUserBio", {
	args: {
		bio: g.string(),
	},
	returns: g.boolean(),
	resolver: "mutations/updateUserBio",
})
g.mutation("updatePersonalLink", {
	args: {
		linkId: g.string(),
		status: g.enumRef(LearningStatus),
	},
	returns: g.boolean(),
	resolver: "mutations/updatePersonalLink",
})
