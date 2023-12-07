import { GraphQLError } from "graphql"
import {
  likeOrUnlikeGlobalLink,
  updateGlobalLinkProgress
} from "../edgedb/crud/global-link"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Resolver } from "@grafbase/generated"

const updateGlobalLinkStatusResolver: Resolver["Mutation.updateGlobalLinkStatus"] =
  async (parent, args, context, info) => {
    try {
      const hankoId = await hankoIdFromToken(context)
      if (hankoId) {
        if (args.action === "like" || args.action === "unlike") {
          await likeOrUnlikeGlobalLink(hankoId, args.globalLinkId, args.action)
          return "ok"
        }
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

export default updateGlobalLinkStatusResolver
