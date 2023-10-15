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
    const fixedMarkdownLinksInHtml = args.topicSummary.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2">$1</a>'
    )
    const sectionsCopy = args.sections.map((section) => {
      const fixedSummary =
        section.summary?.replace(
          /\[(.*?)\]\((.*?)\)/g,
          '<a href="$2">$1</a>'
        ) ?? ""
      return { ...section, summary: fixedSummary }
    })
    const hankoId = await hankoIdFromToken(context)
    console.log(hankoId, "hanko id")
    if (hankoId) {
      await updateGlobalTopic(hankoId, {
        name: args.topicName,
        topicSummary: fixedMarkdownLinksInHtml,
        sections: sectionsCopy
      })
      return "ok"
    }
  } catch (error) {
    throw new GraphQLError(JSON.stringify(error))
  }
}
