import { publicGetGlobalTopics } from "../../edgedb/crud/global-topic"

export default async function getGlobalTopicsResolver(
  root: any,
  args: { topicName: string },
  context: any,
) {
  // TODO: do GraphQLError on failures, check
  const topics = await publicGetGlobalTopics()
  return topics
}
