import { GraphQLError } from "graphql"
import { Context } from "@grafbase/sdk"
import { resetGlobalTopicSections } from "../../edgedb/crud/global-topic"

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
    const authHeader = context.request.headers["Authorization"]
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
    const token = authHeader.split("Bearer ")[1]
    if (token === process.env.INTERNAL_SECRET) {
      // if (token === process.env.INTERNAL_SECRET) {
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
      await resetGlobalTopicSections({
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
