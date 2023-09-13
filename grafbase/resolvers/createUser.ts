import { GraphQLError } from "graphql"
import { addUser } from "../../edgedb/crud/user"
import { validUserEmailFromToken } from "../../lib/grafbase/hanko-validate"

export default async function createUserResolver(
  root: any,
  args: { email: string },
  context: any,
) {
  const email = await validUserEmailFromToken(context)
  if (email) {
    const userId = await addUser({ email: args.email })
    if (userId) {
      return userId
    }
    throw new GraphQLError("User already exists")
  }
}
