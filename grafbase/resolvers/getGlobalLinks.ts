import { hankoIdFromToken } from "../lib/hanko-validate"
import { getAllGlobalLinks } from "../edgedb/crud/global-link"
import { Context } from "@grafbase/sdk"
import { logError } from "../lib/baselime"
import { GraphQLError } from "graphql"

export default async function getGLobalLinksResolver(
  root: any,
  args: any,
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const links = await getAllGlobalLinks()
      return links
    }
  } catch (err) {
    logError("getGlobalLinks", err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
