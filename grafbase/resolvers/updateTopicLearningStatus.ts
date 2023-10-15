import { updateTopicLearningStatus } from "../edgedb/crud/global-topic"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Context } from "@grafbase/sdk"

export default async function updateTopicLearningStatusResolver(
  root: any,
  args: {
    learningStatus: "to_learn" | "learning" | "learned" | "none"
    topicName: string
  },
  context: Context
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    await updateTopicLearningStatus(
      hankoId,
      args.topicName,
      args.learningStatus
    )
  }
}
