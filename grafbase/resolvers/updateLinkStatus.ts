import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { updateGlobalLinkStatus } from "../edgedb/crud/global-link"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function updateLinkStatusResolver(
  root: any,
  args: {
    linkId: string
    action: "like" | "unlike" | "complete" | "uncomplete"
  },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      await updateGlobalLinkStatus(hankoId, args.linkId, args.action)
    }
  } catch (err) {
    console.error(err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
