import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { getPricingUserDetails } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { logError } from "../lib/baselime"

export default async function getPricingUserDetailsResolver(
  root: any,
  args: {},
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const userDetails = await getPricingUserDetails(hankoId)
      return userDetails
    }
  } catch (err) {
    logError("getPricingUserDetails", err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
