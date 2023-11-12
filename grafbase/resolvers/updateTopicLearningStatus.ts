import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import {
  updateTopicLearningStatus,
  updateUnverifiedTopicLearningStatus
} from "../edgedb/crud/global-topic"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function updateTopicLearningStatusResolver(
  root: any,
  args: {
    learningStatus: "to_learn" | "learning" | "learned" | "none"
    topicName: string
    verifiedTopic: boolean
  },
  context: Context
) {
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
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}
