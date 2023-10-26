import { GraphQLError } from "graphql"
import { Context } from "@grafbase/sdk"
import { addLinkToSectionOfGlobalTopic } from "../../edgedb/crud/global-topic"
import { logError } from "../../lib/baselime"

export default async function addGlobalLinkToSection(
  root: any,
  args: { linkUrl: string; topicName: string; sectionName: string },
  context: Context
) {
  try {
    const authHeader = context.request.headers["authorization"]
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
    const token = authHeader.split("Bearer ")[1]
    if (token === process.env.INTERNAL_SECRET) {
      await addLinkToSectionOfGlobalTopic(
        args.topicName,
        args.sectionName,
        args.linkUrl
      )
      return "ok"
    }
  } catch (err) {
    logError("addGlobalLinkToSection", err)
    throw new GraphQLError(JSON.stringify(err))
  }
}
