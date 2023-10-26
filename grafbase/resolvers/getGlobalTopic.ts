import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { getGlobalTopicDetails } from "../edgedb/crud/global-topic"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function getGlobalTopicResolver(
  root: any,
  args: { topicName: string },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const topicDetails = await getGlobalTopicDetails(args.topicName, hankoId)
      return topicDetails
    }
  } catch (err) {
    console.error(err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
