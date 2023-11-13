import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { deletePersonalLink } from "../edgedb/crud/personal-link"
import { hankoIdFromToken } from "../lib/hanko-validate"

const deletePersonalLinkResolver: Resolver["Mutation.deletePersonalLink"] =
  async (parent, args, context, info) => {
    try {
      const hankoId = await hankoIdFromToken(context)
      if (hankoId) {
        await deletePersonalLink(args.personalLinkId)
        return "ok"
      } else {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default deletePersonalLinkResolver
