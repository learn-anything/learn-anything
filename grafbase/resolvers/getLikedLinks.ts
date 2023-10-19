import { Context } from "@grafbase/sdk"
import { getAllLikedLinks } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function getLikedLinksResolver(
  root: any,
  args: any,
  context: Context
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    const links = await getAllLikedLinks(hankoId)
    console.log(links, "links")
    return links
  }
}
