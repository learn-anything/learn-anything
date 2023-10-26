import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { getGlobalLink } from "../edgedb/crud/global-link"
import { hankoIdFromToken } from "../lib/hanko-validate"

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
    console.error(err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
