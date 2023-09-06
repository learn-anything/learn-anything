import { config, g } from "@grafbase/sdk"

export default config({
  schema: g,
})

// const topicPathsOutput = g.input

// g.type("TopicPathOutput", {})

// g.query("getTopicPaths", {
//   returns: g.list(
//     g.object({
//       name: g.string(),
//       urlPath: g.string(),
//     }),
//   ),
//   resolver: "getTopicPaths",
// })

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
