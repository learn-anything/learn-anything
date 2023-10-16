import { Context } from "@grafbase/sdk"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { GraphQLError } from "graphql"
import { getUserDetails } from "../edgedb/crud/user"

export default async function getUserDetailsResolver(
  root: any,
  args: {},
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const user = await getUserDetails(hankoId)
      return user
    }
  } catch (err) {
    throw new GraphQLError(JSON.stringify(err))
  }
}
