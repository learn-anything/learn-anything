import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { getUserDetails } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

const getUserDetailsResolver: Resolver["Query.getUserDetails"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const userDetails = await getUserDetails(hankoId)
      return userDetails
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}

export default getUserDetailsResolver
