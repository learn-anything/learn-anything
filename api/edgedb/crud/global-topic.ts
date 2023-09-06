import { client } from "../client"
import e from "../dbschema/edgeql-js"

type GlobalTopic = {
  name: string
  prettyName: string
  topicSummary: string
  public: true
}

// Add a global topic
export async function addGlobalTopic(topic: GlobalTopic) {
  const query = e.params(
    {
      name: e.str,
      prettyName: e.str,
      topicSummary: e.str,
      public: e.bool,
    },
    (params) => {
      // const newGlobalTopic = e.insert(e.GlobalTopic, {
      //   name: params.name,
      //   prettyName: params.prettyName,
      //   topicSummary: params.topicSummary,
      //   public: params.public,
      // })
      // return e.with([newGlobalTopic],
      //   e.insert(e.GlobalGuide ,{
      //     globalTopic: newGlobalTopic,
      //     sections
      //   })
      //   )
    },
  )
  return query.run(client, {
    name: topic.name,
    prettyName: topic.prettyName,
    topicSummary: topic.topicSummary,
    public: true,
  })
}

// export async function getAllGlobalTopics(topicName: string) {
//   const query = e.select(e.Topic, (topic) => ({
//     filter: e.op(topic.name, "=", topicName),
//   }))
//   const res = await query.run(client)
//   if (res.length === 0) {
//     return false
//   }
//   return true
// }
