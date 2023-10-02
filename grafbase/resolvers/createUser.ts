import { GraphQLError } from "graphql"
import { addUser } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function createUserResolver(
  root: any,
  args: { email: string },
  context: any,
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
