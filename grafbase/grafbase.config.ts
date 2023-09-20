import { config, g } from "@grafbase/sdk"

export default config({
  schema: g,
  auth: {
    rules: (rules) => {
      rules.public()
    },
  },
})

// definitions

// const learningStatus = g.enum("learningStatus", [
//   "to_learn",
//   "learning",
//   "learning",
// ])

const link = g.input("link", {
  title: g.string(),
  url: g.string(),
  author: g.string().optional(),
  year: g.int().optional(),
  completed: g.boolean().optional(),
  addedByUser: g.boolean().optional(),
})

const publicGlobalTopic = g.type("publicGlobalTopic", {
  prettyName: g.string(),
  topicSummary: g.string(),
})

const globalTopic = g.type("globalTopic", {
  prettyName: g.string(),
  topicSummary: g.string(),
  // learningStatus: g.enumRef(learningStatus).optional(),
})

const section = g.input("section", {
  title: g.string(),
  links: g.inputRef(link).list(),
})

// public queries

const outputOfPublicGetGlobalTopics = g.type("outputOfPublicGetGlobalTopics", {
  prettyName: g.string(),
  name: g.string(),
})
g.query("publicGetGlobalTopics", {
  args: {},
  returns: g.ref(outputOfPublicGetGlobalTopics).list(),
  resolver: "public/getGlobalTopics",
})

g.query("publicGetGlobalTopic", {
  args: { topicName: g.string() },
  returns: g.ref(publicGlobalTopic),
  resolver: "public/getGlobalTopic",
})

// auth'd queries

g.query("getGlobalTopic", {
  args: { topicName: g.string() },
  returns: g.ref(globalTopic),
  resolver: "getGlobalTopic",
})

const outputOfCheckForGlobalLink = g.type("outputOfCheckForGlobalLink", {
  url: g.string(),
  title: g.string(),
  year: g.int().optional(),
  description: g.string().optional(),
})
g.query("checkForGlobalLink", {
  args: { linkUrl: g.string() },
  returns: g.ref(outputOfCheckForGlobalLink),
  resolver: "checkForGlobalLink",
})

g.query("stripe", {
  args: { plan: g.string() },
  returns: g.string(),
  resolver: "stripe",
})

// auth'd mutations

g.mutation("createUser", {
  args: { email: g.string(), hankoId: g.string() },
  returns: g.string(),
  resolver: "createUser",
})

g.mutation("uploadProfilePhoto", {
  args: { image: g.string() },
  returns: g.string(),
  resolver: "uploadProfilePhoto",
})

const inputToUpdateGlobalTopic = g.input("inputToUpdateGlobalTopic", {
  topicSummary: g.string(),
  sections: g.inputRef(section).list(),
})
g.mutation("updateGlobalTopic", {
  args: { input: g.inputRef(inputToUpdateGlobalTopic) },
  returns: g.string(),
  resolver: "updateGlobalTopic",
})
