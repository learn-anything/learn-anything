import { updateGlobalTopic } from "../edgedb/crud/global-topic"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { GraphQLError } from "graphql"

export default async function updateGlobalTopicResolver(
  root: any,
  args: { topic: any },
  context: any,
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    await updateGlobalTopic(hankoId, args.topic)
  }
  throw new GraphQLError("Error")
}
