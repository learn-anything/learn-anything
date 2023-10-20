import { Context } from "@grafbase/sdk"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { GraphQLError } from "graphql"
import { getNotesForGlobalTopic } from "../edgedb/crud/global-note"

export default async function getNotesForGlobalTopicResolver(
  root: any,
  args: { topicName: string },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const notes = await getNotesForGlobalTopic(args.topicName)
      return notes
    }
  } catch (err) {
    throw new GraphQLError(JSON.stringify(err))
  }
}
