import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { getTopicsLearned } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { logError } from "../lib/baselime"

export default async function getTopicsLearnedResolver(
  root: any,
  args: {},
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const topics = await getTopicsLearned(hankoId)
      return topics
    }
  } catch (err) {
    logError("getTopicsLearned", err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
