import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Context } from "@grafbase/sdk"
import { getGlobalTopicQuery } from "../edgedb/crud/global-topic"

export default async function getGlobalTopicResolver(
  root: any,
  args: { topicName: string },
  context: Context
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    const topic = await getGlobalTopicQuery(hankoId, args.topicName)
    console.log(topic)
    return topic
  }
  // TODO: make edgedb crud functions return better errors
  // it can also be token validation error! track that
  throw new GraphQLError("Error")
}
