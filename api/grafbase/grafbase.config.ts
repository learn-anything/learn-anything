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

// useful to write shorter resolvers
// won't work if you split config into multiple files: https://discord.com/channels/890534438151274507/1224299258686214144/1224322448837836861
type TypeArguments = Parameters<typeof define.type>
let count = 0
const inline = (fields: TypeArguments[1]) => g.ref(g.type(`Inline${count++}`, fields))

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
//  username: g.string(),
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

// -- mobile queries
g.query("mobileIndex", {
	args: {},
	returns: inline({
		auth: inline({
			filterStatus: g.string(),
		}).optional(),
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
g.mutation("updatePersonalLink", {
	args: {
		linkId: g.string(),
		status: g.enumRef(LearningStatus),
	},
	returns: g.boolean(),
	resolver: "mutations/updatePersonalLink",
})