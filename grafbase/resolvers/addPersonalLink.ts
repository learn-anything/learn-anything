import { GraphQLError } from "graphql"
import { addPersonalLink } from "../edgedb/crud/global-link"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Context } from "@grafbase/sdk"

export default async function addPersonalLinkResolver(
  root: any,
  args: { url: string; title: string; description?: string },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    console.log(args, "args")
    if (hankoId) {
      await addPersonalLink(args.url, args.title, hankoId, args.description)
      return "ok"
    }
  } catch (error) {
    throw new GraphQLError(JSON.stringify(error))
  }
}
