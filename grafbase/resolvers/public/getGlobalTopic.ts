import { GraphQLError } from "graphql"
import { getGlobalTopic } from "../../edgedb/crud/global-topic"

export default async function publicGetGlobalTopicResolver(
  root: any,
  args: { topicName: string },
  context: any,
) {
  const topic = await getGlobalTopic(args.topicName)
  if (topic) {
    return topic
  }
  // TODO: make edgedb crud functions return better errors
  throw new GraphQLError("Error")
}
