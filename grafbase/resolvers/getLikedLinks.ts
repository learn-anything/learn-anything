import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { getAllLikedLinks } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function getLikedLinksResolver(
  root: any,
  args: {},
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const links = await getAllLikedLinks(hankoId)
      return links
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}
