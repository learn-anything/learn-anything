import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { createUser } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

const createUserResolver: Resolver["Mutation.createUser"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const userId = await createUser(args.email, hankoId)
      if (userId) {
        return userId
      }
      throw new GraphQLError("User already exists")
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}

export default createUserResolver
