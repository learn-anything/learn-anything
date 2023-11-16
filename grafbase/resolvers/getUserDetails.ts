import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { getUserDetails } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { ConstraintViolationError } from "edgedb"

const getUserDetailsResolver: Resolver["Query.getUserDetails"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      return await getUserDetails(hankoId)
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    if (err instanceof ConstraintViolationError) {
      throw new GraphQLError("out-of-free-actions")
    } else {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }
}

export default getUserDetailsResolver
