import { GraphQLError } from "graphql"
import { getGlobalTopicPublic } from "../../edgedb/crud/global-topic"
import { Context } from "@grafbase/sdk"
import { logError } from "../../lib/baselime"

export default async function publicGetGlobalTopicResolver(
  root: any,
  args: { topicName: string },
  context: Context
) {
  try {
    const topic = await getGlobalTopicPublic(args.topicName)
    return topic
  } catch (error) {
    logError("publicGetGlobalTopicResolver", error, { args })
    throw new GraphQLError(JSON.stringify(error))
  }
}
