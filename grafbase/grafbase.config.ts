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
  "learned",
])

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

const outputOfGetGlobalLink = g.type("outputOfGetGlobalLink", {
  title: g.string(),
  url: g.string(),
  verified: g.boolean(),
  public: g.boolean(),
  protocol: g.string().optional(),
  fullUrl: g.string().optional(),
  mainTopicAsString: g.string().optional(),
  description: g.string().optional(),
  urlTitle: g.string().optional(),
  year: g.string().optional(),
})
g.query("getGlobalLink", {
  args: { linkId: g.string() },
  returns: g.ref(outputOfGetGlobalLink),
  resolver: "getGlobalLink",
})

const GlobalLink = g.type("GlobalLink", {
  id: g.string(),
  title: g.string(),
  url: g.string(),
  year: g.string().optional(),
})

const globalGuideSection = g.type("globalGuideSection", {
  title: g.string(),
  links: g.ref(GlobalLink).list(),
})

const latestGlobalGuide = g.type("latestGlobalGuide", {
  sections: g.ref(globalGuideSection).list(),
})

const outputOfGetGlobalTopic = g.type("outputOfGetGlobalTopic", {
  prettyName: g.string(),
  topicSummary: g.string(),
  topicPath: g.string().optional(),
  latestGlobalGuide: g.ref(latestGlobalGuide).optional(),
})
g.query("getGlobalTopic", {
  args: { topicName: g.string() },
  returns: g.ref(outputOfGetGlobalTopic),
  resolver: "getGlobalTopic",
})

const outputOfGetGlobalLinks = g.type("outputOfGetGlobalLinks", {
  id: g.string(),
  title: g.string(),
  url: g.string(),
})
g.query("getGlobalLinks", {
  args: {},
  returns: g.ref(outputOfGetGlobalLinks).list(),
  resolver: "getGlobalLinks",
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
  args: { email: g.string() },
  returns: g.string(),
  resolver: "createUser",
})

g.mutation("updateTopicLearningStatus", {
  args: { learningStatus: g.enumRef(learningStatus), topic: g.string() },
  returns: g.string(),
  resolver: "updateTopicLearningStatus",
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
