import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import {
  updateTopicLearningStatus,
  updateUnverifiedTopicLearningStatus
} from "../edgedb/crud/global-topic"
import { hankoIdFromToken } from "../lib/hanko-validate"

// TODO:
// @ts-ignore
const updateTopicLearningStatusResolver: Resolver["Mutation.updateTopicLearningStatus"] =
  async (parent, args, context, info) => {
    try {
      const hankoId = await hankoIdFromToken(context)
      if (hankoId) {
        if (args.verifiedTopic) {
          await updateTopicLearningStatus(
            hankoId,
            args.topicName,
            args.learningStatus
          )
        } else {
          updateUnverifiedTopicLearningStatus(
            hankoId,
            args.topicName,
            args.learningStatus
          )
        }
      } else {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default updateTopicLearningStatusResolver
