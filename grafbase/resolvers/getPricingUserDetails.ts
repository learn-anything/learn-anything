import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { getPricingUserDetails } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function getPricingUserDetailsResolver(
  root: any,
  args: {},
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const userDetails = await getPricingUserDetails(hankoId)
      console.log(userDetails, "user details")
      return userDetails
    }
  } catch (err) {
    throw new GraphQLError(JSON.stringify(err))
  }
}
