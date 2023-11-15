import { GraphQLError } from "graphql"
import { getGlobalTopicPublic } from "../../edgedb/crud/global-topic"
import { Resolver } from "@grafbase/generated"

const publicGetPersonalTopicResolver: Resolver["Query.publicGetGlobalTopic"] =
  async (parent, args, context, info) => {
    try {
      // const publicTopic = await getGlobalTopicPublic(args.topicName)
      // return publicTopic
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default publicGetPersonalTopicResolver
