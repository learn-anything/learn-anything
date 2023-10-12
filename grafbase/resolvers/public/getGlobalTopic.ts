import { GraphQLError } from "graphql"
import { getGlobalTopic } from "../../edgedb/crud/global-topic"

export default async function publicGetGlobalTopicResolver(
  root: any,
  args: { topicName: string },
  context: any,
) {
  try {
    const topic = await getGlobalTopic(args.topicName)
    if (topic) {
      return topic
    }
  } catch (error) {
    throw new GraphQLError(JSON.stringify(error))
  }
}
