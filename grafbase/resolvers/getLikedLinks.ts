import { Context } from "@grafbase/sdk"
import { getAllLikedLinks } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { GraphQLError } from "graphql"
import { logError } from "../lib/baselime"

export default async function getLikedLinksResolver(
  root: any,
  args: any,
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const links = await getAllLikedLinks(hankoId)
      return links
    }
  } catch (err) {
    logError("getLikedLinks", err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
