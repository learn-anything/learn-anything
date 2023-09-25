import { publicGetGlobalTopics } from "../../edgedb/crud/global-topic"
import { GraphQLError } from "graphql"

export default async function getGlobalTopicsResolver(
  root: any,
  args: { topicName: string },
  context: any,
) {
  const topics = await publicGetGlobalTopics()
  if (!topics) {
    throw new GraphQLError(topics)
  }
  return topics
}
