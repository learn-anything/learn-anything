import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { getLearningStatus } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

// TODO:
// @ts-ignore
const getGlobalTopicLearningStatusResolver: Resolver["Query.getGlobalTopicLearningStatus"] =
  async (parent, args, context, info) => {
    try {
      const hankoId = await hankoIdFromToken(context)
      if (hankoId) {
        const status = await getLearningStatus(args.topicName, hankoId)
        return status?.learningStatus
      } else {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default getGlobalTopicLearningStatusResolver
