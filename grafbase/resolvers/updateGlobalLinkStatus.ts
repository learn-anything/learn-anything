import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { updateGlobalLinkStatus } from "../edgedb/crud/global-link"
import { hankoIdFromToken } from "../lib/hanko-validate"

const updateGlobalLinkStatusResolver: Resolver["Mutation.updateGlobalLinkStatus"] =
  async (parent, args, context, info) => {
    try {
      const hankoId = await hankoIdFromToken(context)
      if (hankoId) {
        await updateGlobalLinkStatus(hankoId, args.globalLinkId, args.action)
        return "ok"
      } else {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }
