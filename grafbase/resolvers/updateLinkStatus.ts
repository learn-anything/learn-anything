import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { updateGlobalLinkStatus } from "../edgedb/crud/global-link"
import { hankoIdFromToken } from "../lib/hanko-validate"

// TODO:
// @ts-ignore
const updateLinkStatusResolver: Resolver["Mutation.updateLinkStatusResolver"] =
  async (parent, args, context, info) => {
    try {
      const hankoId = await hankoIdFromToken(context)
      if (hankoId) {
        await updateGlobalLinkStatus(hankoId, args.linkId, args.action)
      } else {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default updateLinkStatusResolver
