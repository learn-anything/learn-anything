import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { getAllGlobalLinks } from "../edgedb/crud/global-link"
import { hankoIdFromToken } from "../lib/hanko-validate"

// TODO: not sure
// @ts-ignore
const getGLobalLinksResolver: Resolver["Query.getGlobalLinks"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      return await getAllGlobalLinks()
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}

export default getGLobalLinksResolver
