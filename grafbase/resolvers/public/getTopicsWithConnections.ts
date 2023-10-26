import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"

export default async function publicGetTopicsWithConnectionsResolver(
  root: any,
  args: {},
  context: Context
) {
  try {
    const { value } = await context.kv.get("topicsWithConnections")
    if (value) {
      const res = JSON.parse(value)
      return res
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}
