import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { getAllLikedLinks } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

// TODO:
// @ts-ignore
const getLikedLinksResolver: Resolver["Query.getLikedLinks"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      return await getAllLikedLinks(hankoId)
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}
