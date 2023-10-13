import { updateTopicLearningStatus } from "../edgedb/crud/global-topic"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Context } from "@grafbase/sdk"

export default async function updateTopicLearningStatusResolver(
  root: any,
  args: { learningStatus: string; topic: string },
  context: Context
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    await updateTopicLearningStatus(hankoId, args.topic, args.learningStatus)
  }
}
