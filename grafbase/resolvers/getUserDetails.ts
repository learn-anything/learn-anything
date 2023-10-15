import { Context } from "@grafbase/sdk"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { GraphQLError } from "graphql"

export default async function getUserDetailsResolver(
  root: any,
  args: {},
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      // TODO:
      return "ok"
    }
  } catch (err) {
    throw new GraphQLError(JSON.stringify(err))
  }
}
