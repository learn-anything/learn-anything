import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Context } from "@grafbase/sdk"

export default async function checkForGlobalLinkResolver(
  root: any,
  args: { email: string },
  context: Context
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    // TODO: mocking for now, update with real db call
    return {
      url: "https://learn-anything.xyz",
      title: "Learn Anything"
    }
  }
  throw new GraphQLError("Error")
}
