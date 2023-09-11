import { publicGetGlobalTopics } from "../../../edgedb/crud/global-topic";

export default async function getGlobalTopicsResolver(
  root: any,
  args: { topicName: string },
  context: any,
) {
  // TODO: can potentially fail?
  // if fail, send GraphQLError
  const topics = await publicGetGlobalTopics()
  return topics
}
