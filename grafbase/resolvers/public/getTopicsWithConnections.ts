import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"

const publicGetTopicsWithConnectionsResolver: Resolver["Query.publicGetTopicsWithConnections"] =
  async (parent, args, context, info) => {
    try {
      const { value } = await context.kv.get("topicsWithConnections")
      if (value) {
        return JSON.parse(value)
      }
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default publicGetTopicsWithConnectionsResolver
