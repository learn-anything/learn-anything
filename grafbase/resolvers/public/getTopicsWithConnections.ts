import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"

export default async function getTopicsWithConnectionsResolver(
  root: any,
  args: {},
  context: Context
) {
  try {
    const { value } = await context.kv.get("topicsWithConnections")
    console.log(value, "value")
    if (value) {
      const res = JSON.parse(value)
      return res
    }
  } catch (err) {
    throw new GraphQLError(JSON.stringify(err))
  }
}
