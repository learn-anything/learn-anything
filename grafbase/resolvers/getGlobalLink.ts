import { Context } from "@grafbase/sdk"
import { getGlobalLink } from "../edgedb/crud/global-link"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { GraphQLError } from "graphql"
import { logError } from "../lib/baselime"

export default async function getGlobalLinkResolver(
  root: any,
  args: { linkId: string },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const link = await getGlobalLink(args.linkId)
      return link
    }
  } catch (err) {
    logError("getGlobalLink", err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
