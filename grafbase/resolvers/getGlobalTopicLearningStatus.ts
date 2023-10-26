import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { getLearningStatus } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

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
    console.error(err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
