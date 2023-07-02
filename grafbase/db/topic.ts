import { client } from "./client"
import e from "./dbschema/edgeql-js"

export interface Link {
  title: string
  url: string
  description?: string
  related?: RelatedLink[]
}

export interface RelatedLink {
  title: string
  url: string
}

export interface Note {
  content: string
  url?: string
}

interface Topic {
  name: string
  content: string
  parentTopic?: string
  notes?: Note[]
  links?: Link[]
}

export async function addTopic(topic: Topic, userId: string) {
  const res = await e
    .insert(e.Topic, {
      user: e
        .select(e.User, (user) => ({
          filter: e.op(user.id, "=", e.uuid(userId)),
        }))
        .assert_single(),
      name: e.str(topic.name),
      content: e.str(topic.content),
    })
    .unlessConflict()
    .toEdgeQL()
  // .run(client)
  console.log(res)
  return res
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
