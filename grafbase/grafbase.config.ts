import { config, g } from "@grafbase/sdk"

export default config({
  schema: g,
  auth: {
    rules: (rules) => {
      rules.public()
    },
  },
})

const learningStatus = g.enum("learningStatus", [
  "to_learn",
  "learning",
  "learning",
])

const link = g.type("Link", {
  title: g.string(),
  url: g.string(),
  author: g.string().optional(),
  year: g.int().optional(),
  completed: g.boolean().optional(),
  addedByUser: g.boolean().optional(),
})

const globalTopicPublic = g.type("GlobalTopicPublic", {
  name: g.string(),
  prettyName: g.string(),
  topicSummary: g.string(),
})

g.query("GlobalTopicPublic", {
  args: { topicName: g.string() },
  returns: g.ref(globalTopicPublic),
  resolver: "public/getGlobalTopic",
})

const globalTopic = g.type("GlobalTopic", {
  name: g.string(),
  prettyName: g.string(),
  topicSummary: g.string(),
  learningStatus: g.enumRef(learningStatus).optional(),
})

g.query("GlobalTopic", {
  args: { topicName: g.string() },
  returns: g.ref(globalTopic),
  resolver: "getGlobalTopic",
})

g.mutation("addUser", {
  args: { email: g.string() },
  returns: g.string(),
  resolver: "addUser",
})

const SectionPublic = g.type("SectionPublic", {
  title: g.string(),
  links: g.ref(link).list(),
})

const globalTopicPublicUpdate = g.input("GlobalTopicPublicUpdate", {
  topicSummary: g.string(),
  sections: g.ref(SectionPublic).list()
})

g.mutation("updateGlobalTopic", {
  args: { input: g.inputRef(globalTopicPublicUpdate) },
  returns: g.string(),
  resolver: "updateGlobalTopic",
})

g.query("stripe", {
  args: { plan: g.string() },
  returns: g.string(),
  resolver: "stripe",
})
