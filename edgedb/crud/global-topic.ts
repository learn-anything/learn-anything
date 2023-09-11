import { client } from "../client"
import e from "../dbschema/edgeql-js"

type GlobalTopic = {
  name: string
  prettyName: string
  topicSummary: string
  public: true
}

export async function getGlobalTopicPublic(topicName: string) {
  const query = e.select(e.GlobalTopic, (globalTopic) => ({
    name: true,
    prettyName: true,
    topicSummary: true,
    filter_single: { name: topicName },
  }))

  const result = await query.run(client)
  return result
}

export async function addNewSectionToGlobalGuide(
  topicName: string,
  sectionTitle: string,
  order: number,
) {
  const query = e.insert(e.GlobalGuideSection, {
    title: sectionTitle,
    order: order,
  })
}

export async function createGlobalTopicWithGlobalGuide(
  topicName: string,
  prettyName: string,
  topicSummary: string,
) {
  const query = e.insert(e.GlobalTopic, {
    name: topicName,
    prettyName: prettyName,
    topicSummary: topicSummary,
    public: true,
    latestGlobalGuide: e.insert(e.GlobalGuide, {}),
  })
  return query.run(client)
}

export async function addSectionToGlobalGuideOfTopic(
  topicName: string,
  sectionName: string,
  order: number,
) {
  const topic = await e
    .select(e.GlobalTopic, () => ({
      filter_single: { name: topicName },
      id: true,
      latestGlobalGuide: true,
    }))
    .run(client)

  // check that `topic` and `latestGlobalGuide` are not null here
  // probably need to add some logic to initialize a new GlobalGuide
  // if it isn't set, right?

  const newSection = await e
    .insert(e.GlobalGuideSection, {
      title: sectionName,
      order: order,
    })
    .run(client)

  if (topic) {
    await e
      .update(e.GlobalGuide, (globalGuide) => {
        return {
          filter_single: { id: topic.latestGlobalGuide.id },
          set: {
            sections: {
              "+=": e.select(e.GlobalGuideSection, () => ({
                filter_single: { id: newSection.id },
              })),
            },
          },
        }
      })
      .run(client)
    console.log("added")
  }
}

// export async function getGlobalTopic(topicName: string, email: string) {
//   const query = e.params(
//     {
//       topicName: e.str,
//       email: e.str,
//     },
//     (params) => {
//       e.select(e.GlobalTopic, (gt) => {
//         const userQuery = e.select(e.User, (user) => {
//           topicsToLearn: e.op("exists", user.topicsToLearn)
//         })
//         return {
//           id: true,
//           name: true,
//           prettyName: true,
//           topicSummary: true,
//           filter_single: { name: topicName },
//           // learningStatus:
//         }
//       })
//     },
//   )

//   return query.run(client, {
//     topicName,
//     email
//   })
// }

// Add a global topic
// export async function addGlobalTopic(topic: GlobalTopic) {
//   const query = e.params(
//     {
//       name: e.str,
//       prettyName: e.str,
//       topicSummary: e.str,
//       public: e.bool,
//     },
//     (params) => {
//       // const newGlobalTopic = e.insert(e.GlobalTopic, {
//       //   name: params.name,
//       //   prettyName: params.prettyName,
//       //   topicSummary: params.topicSummary,
//       //   public: params.public,
//       // })
//       // return e.with([newGlobalTopic],
//       //   e.insert(e.GlobalGuide ,{
//       //     globalTopic: newGlobalTopic,
//       //     sections
//       //   })
//       //   )
//     },
//   )
//   return query.run(client, {
//     name: topic.name,
//     prettyName: topic.prettyName,
//     topicSummary: topic.topicSummary,
//     public: true,
//   })
// }

// export async function getGlobalTopic(topicName: string) {
//   const query = e.params(
//     {
//       name: e.str,
//       prettyName: e.str,
//       topicSummary: e.str,
//       public: e.bool,
//     },
//     (params) => {
//       // const newGlobalTopic = e.insert(e.GlobalTopic, {
//       //   name: params.name,
//       //   prettyName: params.prettyName,
//       //   topicSummary: params.topicSummary,
//       //   public: params.public,
//       // })
//       // return e.with([newGlobalTopic],
//       //   e.insert(e.GlobalGuide ,{
//       //     globalTopic: newGlobalTopic,
//       //     sections
//       //   })
//       //   )
//     },
//   )
//   return query.run(client, {
//     // name: topic.name,
//     // prettyName: topic.prettyName,
//     // topicSummary: topic.topicSummary,
//     // public: true,
//   })
// }

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
