import { client } from "./client"
import e from "./dbschema/edgeql-js"

export interface Link {
  title: string
  url: string
  description: string | null
  related: RelatedLink[]
}

export interface RelatedLink {
  title: string
  url: string
}

export interface Note {
  content: string
  url: string | null
}

interface Topic {
  name: string
  content: string
  parentTopic: string | null
  notes: Note[]
  links: Link[]
}

export async function addTopic(topic: Topic, userId: string) {
  const query = e.params(
    {
      userId: e.uuid,
      topic: e.tuple({
        name: e.str,
        content: e.str,
      }),
      notes: e.json,
      links: e.json,
    },
    (params) =>
      e
        .insert(e.Topic, {
          user: e
            .select(e.User, (user) => ({
              filter: e.op(user.id, "=", params.userId),
            }))
            .assert_single(),
          name: topic.name,
          content: topic.content,
          notes: e.for(e.json_array_unpack(params.notes), (note) =>
            e.insert(e.Note, {
              content: e.cast(e.str, e.json_get(note, "content")),
              url: e.cast(e.str, e.json_get(note, "url")),
            })
          ),
          links: e.for(e.json_array_unpack(params.links), (link) =>
            e.insert(e.Link, {
              title: e.cast(e.str, e.json_get(link, "title")),
              url: e.cast(e.str, e.json_get(link, "url"))
            })
          ),
        })
        .unlessConflict()
  )
  console.log("addTopic", query.toEdgeQL())

  return query.run(client, {
    userId,
    topic: {
      name: topic.name,
      content: topic.content,
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
  console.log(res)
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
  console.log(res)
  return res
}

export async function getTopic(topicName: string, userId: string) {
  const res = await e
    .select(e.Topic, (topic) => ({
      name: true,
      content: true,
      filter: e.op(
        e.op(topic.name, "=", topicName),
        "and",
        e.op(topic.user.id, "=", e.cast(e.uuid, userId))
      ),
    }))
    .run(client)
  console.log(res)
  return res
}

export async function getTopicCount(userId: string) {
  const res = await e
    .select(e.User, (user) => ({
      topicCount: e.count(user.topics),
    }))
    .run(client)
  console.log(res)
  return res
}

export async function getSidebar(userId: string) {
  const res = await e
    .select(e.User, (user) => ({
      topicCount: e.count(user.topics),
    }))
    .run(client)
  console.log(res)
  return res
}
