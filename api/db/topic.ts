import { client } from "./client"
import e from "./dbschema/edgeql-js"

export interface Link {
  title: string
  url: string
  description: string | null
  public: boolean
  related: RelatedLink[]
}

export interface RelatedLink {
  title: string
  url: string
}

export interface Note {
  content: string
  public: boolean
  url: string | null
}

interface Topic {
  name: string
  content: string
  parentTopic: string | null
  public: boolean
  notes: Note[]
  links: Link[]
  prettyName: string
}

export async function addTopic(topic: Topic, userId: string) {
  const query = e.params(
    {
      userId: e.uuid,
      topic: e.tuple({
        name: e.str,
        content: e.str,
        public: e.bool,
        prettyName: e.str,
      }),
      notes: e.json,
      links: e.json,
    },
    (params) => {
      const newTopic = e.insert(e.Topic, {
        user: e
          .select(e.User, (user) => ({
            filter: e.op(user.id, "=", params.userId),
          }))
          .assert_single(),
        name: params.topic.name,
        content: params.topic.content,
        public: params.topic.public,
        prettyName: params.topic.prettyName,
      })

      return e.with(
        [newTopic],
        e.for(e.json_array_unpack(params.notes), (note) =>
          e.op(
            e.insert(e.Note, {
              content: e.cast(e.str, e.json_get(note, "content")),
              url: e.cast(e.str, e.json_get(note, "url")),
              public: e.cast(e.bool, e.json_get(note, "public")),
              topic: e.assert_exists(e.select(newTopic, () => ({ id: true }))),
            }),
            "union",
            e.for(e.json_array_unpack(params.links), (link) =>
              e.insert(e.Link, {
                title: e.cast(e.str, e.json_get(link, "title")),
                url: e.cast(e.str, e.json_get(link, "url")),
                public: e.cast(e.bool, e.json_get(link, "public")),
                topic: e.assert_exists(
                  e.select(newTopic, () => ({
                    filter_single: { id: newTopic.id },
                  }))
                ),
              })
            )
          )
        )
      )
    }
  )
  return query.run(client, {
    userId,
    topic: {
      name: topic.name,
      content: topic.content,
      public: topic.public,
      prettyName: topic.prettyName,
    },
    links: topic.links,
    notes: topic.notes,
  })
}

export async function deleteTopic(id: string) {
  const res = await e
    .delete(e.Topic, (topic) => ({
      filter: e.op(topic.id, "=", id),
    }))
    .run(client)
  return res
}

export async function getTopics() {
  const res = await e
    .select(e.Topic, () => ({
      name: true,
      content: true,
      id: true,
    }))
    .run(client)
  return res
}

export async function getTopic(topicName: string, userId: string) {
  const res = await e
    .select(e.Topic, (topic) => ({
      name: true,
      content: true,
      prettyName: true,
      notes: {
        content: true,
        url: true,
      },
      links: {
        title: true,
        url: true,
      },
      filter: e.op(
        e.op(topic.name, "=", topicName),
        "and",
        e.op(topic.user.id, "=", e.cast(e.uuid, userId))
      ),
    }))
    // .toEdgeQL()
    .run(client)
  return res
}

export async function getTopicCount(userId: string) {
  const res = await e
    .select(e.User, (user) => ({
      topicCount: e.count(user.topics),
    }))
    .run(client)
  return res
}

export async function getSidebar(userId: string) {
  const res = await e
    .select(e.Topic, (topic) => ({
      name: true,
      prettyName: true,
    }))
    .run(client)
  console.log(res, "res")
  return res
}

// connections between topics
// for force graph visualization
export async function getTopicGraph(userId: string) {
  const res = await e
    .select(e.Topic, (topic) => ({
      name: true,
      prettyName: true,
    }))
    .run(client)
  console.log(res, "res")
  return res
}

export async function getLinkCountForTopic(topicName: string, userId: string) {
  const res = await e
    .select(e.Topic, (topic) => ({
      name: true,
      content: true,
      notes: true,
      links: true,
      filter: e.op(
        e.op(topic.name, "=", topicName),
        "and",
        e.op(topic.user.id, "=", e.cast(e.uuid, userId))
      ),
    }))
    .toEdgeQL()
  // .run(client)
  console.log(res)
  return res
}
