import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { getPricingUserDetails } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

// TODO:
// @ts-ignore
const getPricingUserDetailsResolver: Resolver["Query.getPricingUserDetails"] =
  async (parent, args, context, info) => {
    try {
      const hankoId = await hankoIdFromToken(context)
      if (hankoId) {
        return await getPricingUserDetails(hankoId)
      } else {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default getPricingUserDetailsResolver
