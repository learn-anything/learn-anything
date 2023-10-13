import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Context } from "@grafbase/sdk"
import { updateGlobalTopic } from "../edgedb/crud/global-topic"

type Section = {
  title: string
  linkIds: string[]
  summary?: string
}

export default async function updateLatestGlobalGuideResolver(
  root: any,
  args: { topicSummary: string; sections: Section[]; topicName: string },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      await updateGlobalTopic(hankoId, {
        name: args.topicName,
        topicSummary: args.topicSummary,
        sections: args.sections
      })
      return "success"
    }
  } catch (error) {
    throw new GraphQLError(JSON.stringify(error))
  }
}
