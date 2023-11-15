import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { editTopic } from "../edgedb/crud/personal-wiki"

const updateTopicOfWikiResolver: Resolver["Mutation.updateTopicOfWiki"] =
  async (parent, args, context, info) => {
    try {
      const hankoId = await hankoIdFromToken(context)
      if (hankoId) {
        await editTopic(
          hankoId,
          args.topicName,
          args.prettyName,
          args.published,
          args.content,
          args.topicPath
        )
        return "ok"
      } else {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default updateTopicOfWikiResolver
