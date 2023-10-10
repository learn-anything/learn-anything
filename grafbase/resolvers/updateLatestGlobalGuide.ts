import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"

// TODO: not used now but should be used by admins of the topic
// to be able to change latest global guide
export default async function getGlobalTopicResolver(
  root: any,
  args: {},
  context: any,
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
  }
  throw new GraphQLError("Error")
}
