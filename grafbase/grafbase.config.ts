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

const section = g.type("Section", {
  title: g.string(),
  summary: g.string().optional(),
  ordered: g.boolean(),
  links: g.ref(link).list(),
})

const globalTopicPublic = g.type("GlobalTopicPublic", {
  name: g.string(),
  prettyName: g.string(),
  topicSummary: g.string(),
})

g.query("GlobalTopicPublic", {
  args: { topicName: g.string() },
  returns: g.ref(globalTopicPublic),
  resolver: "public/getGlobalTopicPublic",
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

// g.query("GlobalTopic", {
//   args: { topicName: g.string() },
//   returns: g.ref(globalTopic),
//   resolver: "public/getGlobalTopic",
// userLearningStatus: g.enumRef(learningStatus).optional(),
// globalGuideSummary: g.string(),
// globalGuideSections: g.ref(section).list(),
// })

// g.mutation("addUser", {
//   args: { email: g.string() },
//   returns: g.string(),
//   resolver: "createUser",
// })

// g.mutation("")

// g.query("getTopicPaths", {
//   returns: g.list(
//     g.object({
//       name: g.string(),
//       urlPath: g.string(),
//     }),
//   ),
//   resolver: "getTopicPaths",
// })

// const topicPathsOutput = g.input

// g.type("TopicPathOutput", {})

// g.mutation('updateTopic', {
//   args: { name: g.object({
//     summary: g.string(),
//     sections: g.array(g.object({
//       summary: g.string(),
//       links: g.array(g.object(({
//         title: g.string(),
//         url: g.string()
//       })))
//     }))
//   }) },
//   returns: g.string(),
//   resolver: 'updateTopic'
// })