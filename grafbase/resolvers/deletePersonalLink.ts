import { GraphQLError } from "graphql"
import { deletePersonalLink } from "../edgedb/crud/personal-link"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Context } from "@grafbase/sdk"

export default async function deletePersonalLinkResolver(
  root: any,
  args: {
    personalLinkId: string
  },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      await deletePersonalLink(args.personalLinkId)
      return "ok"
    }
  } catch (err) {
    throw new GraphQLError(JSON.stringify(err))
  }
}
