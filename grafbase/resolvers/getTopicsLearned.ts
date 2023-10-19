import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { getTopicsLearned } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function getTopicsLearnedResolver(
  root: any,
  args: {},
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const topics = await getTopicsLearned(hankoId)
      console.log(topics, "topics")
      return topics
    }
  } catch (err) {
    console.log("error?")
    throw new GraphQLError(JSON.stringify(err))
  }
}
