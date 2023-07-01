import { client } from "./client"
import e from "./dbschema/edgeql-js"

export interface Topic {
  name: string
  content: string
}

export async function addTopic(topic: Topic, userId: string) {
  console.log(topic.name, "topic name")
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
    .run(client)
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

export async function getTopicCount(userId: string) {
  const res = await e
    .select(e.User, (user) => ({
      topicCount: e.count(user.topics),
    }))
    .run(client)
  console.log(res)
  return res
}
