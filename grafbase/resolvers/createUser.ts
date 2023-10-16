import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { createUser } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function createUserResolver(
  root: any,
  args: { email: string },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    console.log(hankoId, "hanko id")
    if (hankoId) {
      console.log(hankoId, "hanko id")
      const userId = await createUser(args.email, hankoId)
      console.log("user created: ", userId)
      if (userId) {
        return userId
      }
      console.log("user already exists?")
      throw new GraphQLError("User already exists")
    }
  } catch (err) {
    console.log(err, "error")
    throw new GraphQLError(JSON.stringify(err))
  }
}
