import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { getGlobalLink } from "../edgedb/crud/global-link"
import { hankoIdFromToken } from "../lib/hanko-validate"

// TODO: not sure whats wrong
// @ts-ignore
const getGlobalLinkResolver: Resolver["Query.getGlobalLink"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      return await getGlobalLink(args.linkId)
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}

export default getGlobalLinkResolver
