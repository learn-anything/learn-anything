import { Resolver } from "@grafbase/generated"
import { ConstraintViolationError } from "edgedb"
import { GraphQLError } from "graphql"
import {
  updateTopicLearningStatus,
  updateUnverifiedTopicLearningStatus
} from "../edgedb/crud/global-topic"
import { hankoIdFromToken } from "../lib/hanko-validate"

const updateTopicLearningStatusResolver: Resolver["Mutation.updateTopicLearningStatus"] =
  async (parent, args, context, info) => {
    try {
      const hankoId = await hankoIdFromToken(context)
      if (hankoId) {
        if (args.verifiedTopic) {
          const res = await updateTopicLearningStatus(
            hankoId,
            args.topicName,
            args.learningStatus
          )
          // if (res.id) {}
          return "ok"
        } else {
          updateUnverifiedTopicLearningStatus(
            hankoId,
            args.topicName,
            args.learningStatus
          )
          return "ok"
        }
      } else {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
    } catch (err) {
      if (err instanceof ConstraintViolationError) {
        throw new GraphQLError("out-of-free-actions")
      } else {
        console.error(err)
        throw new GraphQLError(JSON.stringify(err))
      }
    }
  }

export default updateTopicLearningStatusResolver
