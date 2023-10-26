import { Context } from "@grafbase/sdk"
import { publicGetGlobalTopics } from "../../edgedb/crud/global-topic"
import { logError } from "../../lib/baselime"
import { GraphQLError } from "graphql"

export default async function publicGetGlobalTopicsResolver(
  root: any,
  args: { topicName: string },
  context: Context
) {
  try {
    const topics = await publicGetGlobalTopics()
    return topics
  } catch (err) {
    logError("publicGetGlobalTopicsResolver", err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
