import { client } from "./client"

export interface Topic {
  name: string
  content: string
}

export async function addTopic(topic: Topic, userId: string) {
  const res = await client.query(
    `
    insert Topic {
      user := (select User filter .id = <uuid>$userId),
      name := <str>$topicName,
      content := <str>$topicContent
    }
  `,
    {
      userId: userId,
      topicName: topic.name,
      topicContent: topic.content,
    }
  )
  console.log(res)
  return res
}

export async function deleteTopic(id: string) {
  const res = await client.query(`
  delete Topic
  filter .id = <uuid>'${id}'`)
  console.log(res)
  return res
}

export async function getTopics() {
  const res = await client.query(`
  select Topic {
    name,
    content,
    id
  }`)
  console.log(res)
  return res
}
