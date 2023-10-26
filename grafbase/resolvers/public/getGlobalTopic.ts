import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { getGlobalTopicPublic } from "../../edgedb/crud/global-topic"

export default async function publicGetGlobalTopicResolver(
  root: any,
  args: { topicName: string },
  context: Context
) {
  try {
    const topic = await getGlobalTopicPublic(args.topicName)
    return topic
  } catch (err) {
    console.error(err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
