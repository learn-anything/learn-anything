import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { logError } from "../../lib/baselime"

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
    logError("publicGetTopicsWithConnections", err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
