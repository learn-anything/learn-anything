import { client } from "../client"
import e from "../dbschema/edgeql-js"

export async function getNotesForGlobalTopic(topicName: string) {
  return await e
    .select(e.GlobalNote, (gn) => ({
      filter: e.op(gn.mainTopic.name, "=", topicName),
      content: true,
      url: true
    }))
    .run(client)
}

export async function addGlobalNote(
  content: string,
  mainGlobalTopicName: string,
  url?: string
) {
  const noteExists = await e
    .select(e.GlobalNote, (gn) => ({
      filter: e.op(gn.content, "=", content)
    }))
    .run(client)
  if (noteExists.length > 0) {
    console.log("note exists")
    return
  }
  if (url) {
    await e
      .insert(e.GlobalNote, {
        content: content,
        url: url,
        mainTopic: e.select(e.GlobalTopic, () => ({
          filter_single: { name: mainGlobalTopicName }
        }))
      })
      .run(client)
  } else {
    await e
      .insert(e.GlobalNote, {
        content: content,
        mainTopic: e.select(e.GlobalTopic, () => ({
          filter_single: { name: mainGlobalTopicName }
        }))
      })
      .run(client)
  }
}
