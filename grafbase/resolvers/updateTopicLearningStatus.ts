import {
  updateTopicLearningStatus,
  updateUnverifiedTopicLearningStatus
} from "../edgedb/crud/global-topic"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Context } from "@grafbase/sdk"

export default async function updateTopicLearningStatusResolver(
  root: any,
  args: {
    learningStatus: "to_learn" | "learning" | "learned" | "none"
    topicName: string
    verifiedTopic: boolean
  },
  context: Context
) {
  console.log(args, "args")
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
}
