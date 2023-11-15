import { GraphQLError } from "graphql"
import { addLinkToSectionOfGlobalTopic } from "../../edgedb/crud/global-topic"
import { Resolver } from "@grafbase/generated"

const addGlobalLinkToSectionResolver: Resolver["Mutation.internalAddGlobalLinkToSection"] =
  async (parent, args, context, info) => {
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
      } else {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default addGlobalLinkToSectionResolver
