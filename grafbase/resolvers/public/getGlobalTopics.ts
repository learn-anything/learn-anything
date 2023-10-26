import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { publicGetGlobalTopics } from "../../edgedb/crud/global-topic"

export default async function publicGetGlobalTopicsResolver(
  root: any,
  args: { topicName: string },
  context: Context
) {
  try {
    const topics = await publicGetGlobalTopics()
    return topics
  } catch (err) {
    console.error(err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
