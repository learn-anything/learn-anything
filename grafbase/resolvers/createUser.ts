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
    if (hankoId) {
      const userId = await createUser(args.email, hankoId)
      if (userId) {
        console.log("created user", {
          userId,
          email: args.email
        })
        return userId
      }
      console.error("User already exists", {
        userId,
        email: args.email
      })
      throw new GraphQLError("User already exists")
    }
  } catch (err) {
    console.error(err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
