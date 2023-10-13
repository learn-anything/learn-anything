import { GraphQLError } from "graphql"
import { addUser } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Context } from "@grafbase/sdk"

export default async function createUserResolver(
  root: any,
  args: { email: string },
  context: Context
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    const userId = await addUser({ email: args.email, hankoId: hankoId })
    if (userId) {
      return userId
    }
    throw new GraphQLError("User already exists")
  }
}
