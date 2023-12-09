import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { getTopicsLearned } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

const getTopicsLearnedResolver: Resolver["Query.getTopicsLearned"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const topics = await getTopicsLearned(hankoId)
      console.log(topics, "topics")
      return topics
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}

export default getTopicsLearnedResolver
