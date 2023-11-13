import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { getGlobalTopicDetails } from "../edgedb/crud/global-topic"
import { hankoIdFromToken } from "../lib/hanko-validate"

// TODO: not sure
// @ts-ignore
const getGlobalTopicResolver: Resolver["Query.getGlobalTopic"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      return await getGlobalTopicDetails(args.topicName, hankoId)
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}

export default getGlobalTopicResolver
