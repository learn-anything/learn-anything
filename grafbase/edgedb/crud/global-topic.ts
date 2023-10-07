import { client } from "../client"
import e from "../dbschema/edgeql-js"

export async function updateTopicLearningStatus(
  hankoId: string,
  topic: string,
  learningStatus: string,
) {
  const userByHankoId = e.select(e.User, (user) => ({
    filter: e.all(
      e.set(
        e.op(user.hankoId, "=", hankoId),
        e.op("exists", user.memberUntil),
        e.op(user.memberUntil, ">", e.datetime_current()),
      ),
    ),
  }))
  const topicByName = e.select(e.GlobalTopic, () => ({
    filter_single: { name: topic },
  }))

  switch (learningStatus) {
    case "to_learn":
      return e
        .update(userByHankoId, (user) => ({
          set: {
            topicsToLearn: { "+=": topicByName },
            topicsLearning: { "-=": topicByName },
            topicsLearned: { "-=": topicByName },
          },
        }))
        .run(client)

    case "learning":
      return e
        .update(userByHankoId, (user) => ({
          set: {
            topicsToLearn: { "-=": topicByName },
            topicsLearning: { "+=": topicByName },
            topicsLearned: { "-=": topicByName },
          },
        }))
        .run(client)
    case "learned":
      return e
        .update(userByHankoId, (user) => ({
          set: {
            topicsToLearn: { "-=": topicByName },
            topicsLearning: { "-=": topicByName },
            topicsLearned: { "+=": topicByName },
          },
        }))
        .run(client)
    default:
      break
  }
}

// for use in landing page (learn-anything.xyz) to get results of topics to search over
// its public because in future for auth'd users, we can show more custom results
// based of user preference etc.
export async function publicGetGlobalTopics() {
  const globalTopics = await e
    .select(e.GlobalTopic, () => ({
      prettyName: true,
      name: true,
    }))
    .run(client)
  return globalTopics
}

// get all info needed to render global topic page (i.e. learn-anything.xyz/physics)
export async function getGlobalTopic(topicName: string) {
  const topic = await e
    .select(e.GlobalTopic, () => ({
      filter_single: { name: topicName },
      id: true,
      prettyName: true,
      topicSummary: true,
      topicPath: true,
      latestGlobalGuide: {
        sections: {
          title: true,
          links: {
            id: true,
            title: true,
            url: true,
            year: true,
            protocol: true,
          },
          order: true,
        },
      },
    }))
    .run(client)

  if (topic) {
    const links = await e
      .select(e.GlobalLink, (gl) => ({
        filter: e.op(gl.mainTopic.id, "=", e.cast(e.uuid, topic.id)),
        id: true,
        title: true,
        url: true,
        year: true,
        protocol: true,
      }))
      .run(client)

    const combined = { ...topic, links }
    return combined
  }
  throw new Error("topic not found")
}

export async function addSectionToGlobalTopic(
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

  const newSection = await e
    .insert(e.GlobalGuideSection, {
      title: sectionName,
      order: order,
    })
    .run(client)

  if (topic) {
    return await e
      .update(e.GlobalGuide, () => {
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
  }
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

// export async function editGlobalGuide(globalTopic: string) {
//   const query = e.update(e.GlobalGuide, {

//   })
// }

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

// type GlobalTopic = {
//   name: string
//   prettyName: string
//   topicSummary: string
//   public: true
// }

// export async function getGlobalTopics(topicName: string) {
//   const query = e.select(e.GlobalTopic, (globalTopic) => ({
//     name: true,
//     prettyName: true,
//     topicSummary: true,
//     filter_single: { name: topicName },
//   }))

//   const result = await query.run(client)
//   return result
// }
