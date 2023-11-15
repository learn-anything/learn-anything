import { client } from "../client"
import e from "../dbschema/edgeql-js"

// TODO: this file should be renamed personal-topic.ts
// as we move away from just topic to personal-topic

// Add a topic to a wiki of a user
export async function addTopic(topic: any, wikiId: string, topicPath: string) {
  const query = e.params(
    {
      wikiId: e.uuid,
      topic: e.tuple({
        name: e.str,
        prettyName: e.str,
        public: e.bool,
        content: e.str
      }),
      notes: e.json,
      links: e.json,
      topicPath: e.str
    },
    (params) => {
      const newTopic = e
        .insert(e.Topic, {
          wiki: e.assert_exists(
            e.assert_single(
              e.select(e.PersonalWiki, (wiki) => ({
                filter: e.op(wiki.id, "=", e.cast(e.uuid, wikiId))
              }))
            )
          ),
          name: topic.name,
          prettyName: topic.prettyName,
          public: topic.public,
          content: topic.content,
          topicPath: topicPath
        })
        .unlessConflict((topic) => ({
          on: topic.name
        }))
      return e.with(
        [newTopic],
        e.select(
          e.op(
            e.for(e.json_array_unpack(params.notes), (note) =>
              e.insert(e.Note, {
                content: e.cast(e.str, e.json_get(note, "content")),
                url: e.cast(e.str, e.json_get(note, "url")),
                public: e.cast(e.bool, e.json_get(note, "public")),
                topic: newTopic
              })
            ),
            "union",
            e.for(e.json_array_unpack(params.links), (link) =>
              e.insert(e.Link, {
                title: e.cast(e.str, e.json_get(link, "title")),
                url: e.cast(e.str, e.json_get(link, "url")),
                description: e.cast(e.str, e.json_get(link, "description")),
                public: e.cast(e.bool, e.json_get(link, "public")),
                topic: newTopic,
                year: e.cast(e.str, e.json_get(link, "year")),
                relatedLinks: e.for(
                  e.json_array_unpack(e.json_get(link, "relatedLinks")),
                  (relatedLink) =>
                    e.insert(e.RelatedLink, {
                      url: e.cast(e.str, e.json_get(relatedLink, "url")),
                      title: e.cast(e.str, e.json_get(relatedLink, "title"))
                    })
                )
                // globalLink: e.insert(e.GlobalLink, {
                //   title: e.cast(e.str, e.json_get(link, "title")),
                //   url: e.cast(e.str, e.json_get(link, "url")),
                //   description: e.cast(e.str, e.json_get(link, "description")),
                //   public: e.cast(e.bool, e.json_get(link, "public")),
                //   year: e.cast(e.str, e.json_get(link, "year")),
                //   relatedLinks: e.for(
                //     e.json_array_unpack(e.json_get(link, "relatedLinks")),
                //     (relatedLink) =>
                //       e.insert(e.RelatedLink, {
                //         url: e.cast(e.str, e.json_get(relatedLink, "url")),
                //         title: e.cast(e.str, e.json_get(relatedLink, "title"))
                //       })
                //   )
                // })
                // TODO: was crashing for random reason
                // even though below code should in theory prevent it
                // made url not unique to avoid this
                // .unlessConflict((gl) => ({ on: gl.url })),
              })
            )
          )
        )
      )
    }
  )
  return query.run(client, {
    wikiId,
    topic: {
      name: topic.name,
      prettyName: topic.prettyName,
      public: topic.public,
      content: topic.content
    },
    links: topic.links,
    notes: topic.notes,
    topicPath: topicPath
  })
}

// Get all details to render the topic page
// learn-anything.xyz/<global-topic>
export async function getGlobalTopic(topicName: string) {
  const query = e.select(e.Topic, (topic) => ({
    filter: e.op(topic.name, "=", topicName),
    name: true,
    content: true,
    notes_count: e.count(topic.notes),
    link_count: e.count(topic.links),
    notes: {
      content: true,
      url: true,
      additionalContent: true
    },
    links: {
      title: true,
      url: true,
      description: true,
      relatedLinks: {
        title: true,
        url: true,
        description: true
      }
    }
  }))
  return query.run(client)
}

// get everything related to topic
export async function getTopic(name: string) {
  const query = e.select(e.Topic, (topic) => ({
    name: true,
    prettyName: true,
    public: true,
    content: true,
    topicPath: true,
    notes: {
      content: true,
      url: true,
      additionalContent: true
    },
    links: {
      title: true,
      url: true,
      description: true,
      year: true,
      topic: {
        name: true
      },
      globalLink: {
        title: true,
        url: true,
        description: true,
        year: true
      },
      relatedLinks: {
        url: true,
        title: true
      }
    },
    filter: e.op(topic.name, "=", name)
  }))

  return query.run(client)
}

export async function topicExists(topicName: string) {
  const query = e.select(e.Topic, (topic) => ({
    filter: e.op(topic.name, "=", topicName)
  }))
  const res = await query.run(client)
  if (res.length === 0) {
    return false
  }
  return true
}

// export async function getTopic(wikiId: string) {
//   const query = e.select(e.Topic, (topic) => ({
//     name: true,
//     prettyName: true,
//     filter: e.op(topic.wiki.id, "=", e.cast(e.uuid, wikiId)),
//   }))

//   return query.run(client)
// }

// export interface Link {
//   title: string
//   url: string
//   description: string | null
//   public: boolean
//   related: RelatedLink[]
// }

// export interface RelatedLink {
//   title: string
//   url: string
// }

// export interface Note {
//   content: string
//   public: boolean
//   url: string | null
// }

// // interface OldTopic {
// //   name: string
// //   content: string
// //   parentTopic: string | null
// //   public: boolean
// //   notes: Note[]
// //   links: Link[]
// //   prettyName: string
// // }

export async function deleteTopic(topicId: string) {
  // Delete all Link objects associated with the Topic
  await e
    .delete(e.Link, (link) => ({
      filter: e.op(link.topic.id, "=", e.cast(e.uuid, topicId))
    }))
    .run(client)

  // Delete all Note objects associated with the Topic
  await e
    .delete(e.Note, (note) => ({
      filter: e.op(note.topic.id, "=", e.cast(e.uuid, topicId))
    }))
    .run(client)

  // Delete the Topic
  const res = await e
    .delete(e.Topic, (topic) => ({
      filter: e.op(topic.id, "=", e.cast(e.uuid, topicId))
    }))
    .run(client)
  return res
}

export async function getTopics() {
  const res = await e
    .select(e.Topic, () => ({
      name: true,
      content: true,
      id: true
    }))
    .run(client)
  return res
}

export async function getTopicTitles() {
  const res = await e
    .select(e.Topic, () => ({
      name: true
    }))
    .run(client)
  return res
}

// export async function getTopic(topicName: string, userId: string) {
//   const res = await e
//     .select(e.Topic, (topic) => ({
//       name: true,
//       content: true,
//       prettyName: true,
//       notes: {
//         content: true,
//         url: true,
//       },
//       links: {
//         title: true,
//         url: true,
//       },
//       filter: e.op(
//         e.op(topic.name, "=", topicName),
//         "and",
//         e.op(topic.user.id, "=", e.cast(e.uuid, userId)),
//       ),
//     }))
//     // .toEdgeQL()
//     .run(client)
//   return res
// }

// export async function getTopicCount(userId: string) {
//   const res = await e
//     .select(e.User, (user) => ({
//       topicCount: e.count(user.topics),
//     }))
//     .run(client)
//   return res
// }

// export async function getSidebar(userId: string) {
//   const res = await e
//     .select(e.Topic, (topic) => ({
//       name: true,
//       prettyName: true,
//     }))
//     .run(client)
//   console.log(res, "res")
//   return res
// }

// connections between topics
// for force graph visualization
export async function getTopicGraph(userId: string) {
  const res = await e
    .select(e.Topic, (topic) => ({
      name: true,
      prettyName: true
    }))
    .run(client)
  console.log(res, "res")
  return res
}

// export async function getLinkCountForTopic(topicName: string, userId: string) {
//   const res = await e
//     .select(e.Topic, (topic) => ({
//       name: true,
//       content: true,
//       notes: true,
//       links: true,
//       filter: e.op(
//         e.op(topic.name, "=", topicName),
//         "and",
//         e.op(topic.user.id, "=", e.cast(e.uuid, userId)),
//       ),
//     }))
//     .toEdgeQL()
//   // .run(client)
//   console.log(res)
//   return res
// }
