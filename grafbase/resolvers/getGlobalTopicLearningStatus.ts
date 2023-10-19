import { Context } from "@grafbase/sdk"
import { getLearningStatus } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function getGlobalTopicLearningStatusResolver(
  root: any,
  args: { topicName: string },
  context: Context
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    const status = await getLearningStatus(args.topicName, hankoId)
    return status?.learningStatus
  }
}
