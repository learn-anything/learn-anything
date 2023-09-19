import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function checkForGlobalLinkResolver(
  root: any,
  args: { email: string },
  context: any,
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    // TODO: mocking for now, update with real db call
    return {
      url: "https://learn-anything.xyz",
      title: "Learn Anything",
    }
  }
  throw new GraphQLError("Error")
}
