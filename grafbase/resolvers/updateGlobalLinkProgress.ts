import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { updateGlobalLinkProgress } from "../edgedb/crud/global-link"
import { hankoIdFromToken } from "../lib/hanko-validate"

const updateGlobalLinkProgressResolver: Resolver["Mutation.updateGlobalLinkProgress"] =
  async (parent, args, context, info) => {
    try {
      const hankoId = await hankoIdFromToken(context)
      if (hankoId) {
        await updateGlobalLinkProgress(hankoId, args.globalLinkId, args.action)
        return "ok"
      } else {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default updateGlobalLinkProgressResolver
