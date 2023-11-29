import { Resolver } from "@grafbase/generated"
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
          console.log(res, "res")
          if (res === null) {
            // TODO: should be more descriptive error
            // need to update the edgedb-js query for that
            throw new GraphQLError("not-regular-member")
          }
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
      console.error(err, "error")
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default updateTopicLearningStatusResolver
