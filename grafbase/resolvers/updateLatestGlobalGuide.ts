import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { updateGlobalTopic } from "../edgedb/crud/global-topic"

type Section = {
  title: string
  linkIds: string[]
  summary?: string
}

// TODO: not used now but should be used by admins of the topic
// to be able to change latest global guide
export default async function getGlobalTopicResolver(
  root: any,
  args: { topicSummary: string; sections: Section[] },
  context: any,
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    await updateGlobalTopic(hankoId, {
      name: "3d-printing",
      prettyName: "3D Printing",
      topicSummary: args.topicSummary,
      sections: args.sections,
    })
  }
  throw new GraphQLError("Error")
}
