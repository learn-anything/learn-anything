import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { getAllLikedLinks } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

const getAllLinksResolver: Resolver["Query.getLikedLinks"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const links = await getAllLikedLinks(hankoId)
      console.log(links, "links")
      return links
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}

export default getAllLinksResolver
