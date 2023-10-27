import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { getUserDetails } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function getUserDetailsResolver(
  root: any,
  args: {},
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      console.log(hankoId, "hanko id")
      const user = await getUserDetails(hankoId)
      console.log(user, "user details")
      return user
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}
