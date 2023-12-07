import { GraphQLError } from "graphql"
import { getGlobalTopicPublic } from "../../edgedb/crud/global-topic"
import { Resolver } from "@grafbase/generated"

const publicGetGlobalTopicResolver: Resolver["Query.publicGetGlobalTopic"] =
  async (parent, args, context, info) => {
    try {
      const publicTopic = await getGlobalTopicPublic(args.topicName)
      if (!publicTopic) {
        throw new GraphQLError("Topic not found")
      }
      return publicTopic
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default publicGetGlobalTopicResolver
