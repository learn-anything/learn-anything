import { config, g } from "@grafbase/sdk"

export default config({
  schema: g,
})

// g.enum

const topic = g.type("Topic", {
  name: g.string(),
  // status: ""
})

g.query("getTopic", {
  args: { topic: g.string() },
  returns: g.ref(topic),
  resolver: "getTopic",
})

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
