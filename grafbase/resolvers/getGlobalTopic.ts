import { GraphQLError } from "graphql"
import { getGlobalTopic } from "../../edgedb/crud/global-topic"
import { validUserEmailFromToken } from "../../lib/grafbase/hanko-validate"

export default async function getGlobalTopicResolver(
  root: any,
  args: { topicName: string },
  context: any,
) {
  const email = await validUserEmailFromToken(context)
  if (email) {
    const topic = await getGlobalTopic(args.topicName)
    console.log(JSON.stringify(topic), "topic")
    return topic
  }
  // TODO: make edgedb crud functions return better errors
  // it can also be token validation error! track that
  throw new GraphQLError("Error")
}
