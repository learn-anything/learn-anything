import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { publicGetGlobalTopics } from "../../edgedb/crud/global-topic"

const publicGetGlobalTopicsResolver: Resolver["Query.publicGetGlobalTopics"] =
  async (parent, args, context, info) => {
    try {
      return await publicGetGlobalTopics()
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default publicGetGlobalTopicsResolver
