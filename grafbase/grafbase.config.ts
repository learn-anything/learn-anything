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

const learningStatus = g.enum("learningStatus", [
  "to_learn",
  "learning",
  "learning",
])

const link = g.type("link", {
  title: g.string(),
  url: g.string(),
  author: g.string().optional(),
  year: g.int().optional(),
  completed: g.boolean().optional(),
  addedByUser: g.boolean().optional(),
})

const publicGlobalTopic = g.type("publicGlobalTopic", {
  name: g.string(),
  prettyName: g.string(),
  topicSummary: g.string(),
})

const globalTopic = g.type("globalTopic", {
  name: g.string(),
  prettyName: g.string(),
  topicSummary: g.string(),
  learningStatus: g.enumRef(learningStatus).optional(),
})

const section = g.type("section", {
  title: g.string(),
  links: g.ref(link).list(),
})

// public queries

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

g.query("stripe", {
  args: { plan: g.string() },
  returns: g.string(),
  resolver: "stripe",
})

// auth'd mutations

g.mutation("createUser", {
  args: { email: g.string() },
  returns: g.string(),
  resolver: "createUser",
})

const inputToUpdateGlobalTopic = g.input("inputToUpdateGlobalTopic", {
  topicSummary: g.string(),
  sections: g.ref(section).list()
})
g.mutation("updateGlobalTopic", {
  args: { input: g.inputRef(inputToUpdateGlobalTopic) },
  returns: g.string(),
  resolver: "updateGlobalTopic",
})
