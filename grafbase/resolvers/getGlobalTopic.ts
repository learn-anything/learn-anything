import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { getGlobalTopicDetails } from "../edgedb/crud/global-topic"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function getGlobalTopicResolver(
  root: any,
  args: { topicName: string },
  context: Context
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    const topicDetails = await getGlobalTopicDetails(args.topicName, hankoId)
    return topicDetails
  }
  // TODO: make edgedb crud functions return better errors
  // it can also be token validation error! track that
  throw new GraphQLError("Error")
}
