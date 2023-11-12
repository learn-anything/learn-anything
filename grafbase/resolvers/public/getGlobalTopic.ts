import { GraphQLError } from "graphql"
import { getGlobalTopicPublic } from "../../edgedb/crud/global-topic"
import { Resolver } from "@grafbase/generated"

// TODO: some complex mismatch
// @ts-ignore
const publicGetGlobalTopicResolver: Resolver["Query.publicGetGlobalTopic"] =
  async (parent, args, context, info) => {
    try {
      return await getGlobalTopicPublic(args.topicName)
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }
