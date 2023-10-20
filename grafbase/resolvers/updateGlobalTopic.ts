import { Context } from "@grafbase/sdk"
import { resetGlobalTopicSections } from "../edgedb/crud/global-topic"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { GraphQLError } from "graphql"

export default async function updateGlobalTopicResolver(
  root: any,
  args: { topic: any },
  context: Context
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    await resetGlobalTopicSections(hankoId, args.topic)
  }
  throw new GraphQLError("Error")
}
