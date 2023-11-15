import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { getNotesForGlobalTopic } from "../edgedb/crud/global-note"
import { hankoIdFromToken } from "../lib/hanko-validate"

const getNotesForGlobalTopicResolver: Resolver["Query.getNotesForGlobalTopic"] =
  async (parent, args, context, info) => {
    try {
      const hankoId = await hankoIdFromToken(context)
      if (hankoId) {
        return await getNotesForGlobalTopic(args.topicName)
      } else {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default getNotesForGlobalTopicResolver
