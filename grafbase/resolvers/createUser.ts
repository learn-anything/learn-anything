import { GraphQLError } from "graphql"
import { addUser } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { log, logError } from "../lib/baselime"
import { Context } from "@grafbase/sdk"

export default async function createUserResolver(
  root: any,
  args: { email: string },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const userId = await addUser({ email: args.email, hankoId: hankoId })
      log("user created: ", { userId })
      log("just a log")
      if (userId) {
        return userId
      }
      throw new GraphQLError("User already exists")
    }
  } catch (err) {
    logError("error creating user", { err })
    throw new GraphQLError(JSON.stringify(err))
  }
}
