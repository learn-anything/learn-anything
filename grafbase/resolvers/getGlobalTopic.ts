import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { getGlobalTopic } from "../edgedb/crud/global-topic"

export default async function getGlobalTopicResolver(
  root: any,
  args: { topicName: string },
  context: any,
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    const topic = await getGlobalTopic(args.topicName)
    console.log(JSON.stringify(topic), "topic")
    return topic
  }
  // TODO: make edgedb crud functions return better errors
  // it can also be token validation error! track that
  throw new GraphQLError("Error")
}
