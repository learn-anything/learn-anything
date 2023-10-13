import { Context } from "@grafbase/sdk"
import { getGlobalLink } from "../edgedb/crud/global-link"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function getGlobalLinkResolver(
  root: any,
  args: { linkId: string },
  context: Context
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    const link = await getGlobalLink(args.linkId)
    return link
  }
}
