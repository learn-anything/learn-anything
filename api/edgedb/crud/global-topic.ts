import { Topic } from "../cli/cli"
import { client } from "../client"
import e from "../dbschema/edgeql-js"

type GlobalTopic = {
  name: string
  prettyName: string
  topicSummary: string
}

// Add a global topic
export async function addGlobalTopic(topic: GlobalTopic) {}

export async function getAllGlobalTopics(topicName: string) {
  const query = e.select(e.Topic, (topic) => ({
    filter: e.op(topic.name, "=", topicName),
  }))
  const res = await query.run(client)
  if (res.length === 0) {
    return false
  }
  return true
}
