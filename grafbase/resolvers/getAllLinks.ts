import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { getAllLinks } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

const getAllLinksResolver: Resolver["Query.getAllLinks"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const links = await getAllLinks(hankoId)
      if (links) {
        return links
      }
      throw new GraphQLError("No links found")
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}

export default getAllLinksResolver
