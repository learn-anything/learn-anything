import { GraphQLError } from "graphql"
import { resetGlobalTopicSections } from "../../edgedb/crud/global-topic"
import { Resolver } from "@grafbase/generated"

const updateLatestGlobalGuideResolver: Resolver["Mutation.internalUpdateLatestGlobalGuide"] =
  async (parent, args, context, info) => {
    try {
      const authHeader = context.request.headers["authorization"]
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
      {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default updateLatestGlobalGuideResolver
