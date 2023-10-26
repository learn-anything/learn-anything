import { Context } from "@grafbase/sdk"
import { getLearningStatus } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { logError } from "../lib/baselime"
import { GraphQLError } from "graphql"

export default async function getGlobalTopicLearningStatusResolver(
  root: any,
  args: { topicName: string },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const status = await getLearningStatus(args.topicName, hankoId)
      return status?.learningStatus
    }
  } catch (err) {
    logError("getGlobalTopicLearningStatus", err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
