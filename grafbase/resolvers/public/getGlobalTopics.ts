// TODO: type resolver, no any

import { getGlobalTopics } from "../../../edgedb/crud/global-topic";

export default async function getGlobalTopicsResolver(
  root: any,
  args: { topicName: string },
  context: any,
) {
  const topics = await getGlobalTopics()
  return topics
}
