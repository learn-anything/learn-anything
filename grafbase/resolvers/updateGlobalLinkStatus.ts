import { GraphQLError } from "graphql"
import { updateGlobalLinkStatus } from "../edgedb/crud/global-link"
import { logError } from "../lib/baselime"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Context } from "@grafbase/sdk"

export default async function updateGlobalLinkStatusResolver(
  root: any,
  args: {
    globalLinkId: string
    action: "like" | "unlike" | "complete" | "uncomplete"
  },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      await updateGlobalLinkStatus(hankoId, args.globalLinkId, args.action)
      return "ok"
    }
  } catch (err) {
    logError("updateGlobalLinkStatus", err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
