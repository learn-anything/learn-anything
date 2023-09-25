import { GraphQLError } from "graphql"
import { updateTopicLearningStatus } from "../edgedb/crud/global-topic"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function updateTopicLearningStatusResolver(
  root: any,
  args: { learningStatus: string; topic: string },
  context: any,
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    const res = await updateTopicLearningStatus(
      hankoId,
      args.topic,
      args.learningStatus,
    )
  }
}
