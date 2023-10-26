import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"

export default async function updateGrafbaseKvResolver(
  root: any,
  args: { topicsWithConnections: any },
  context: Context
) {
  try {
    const authHeader = context.request.headers["authorization"]
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
    const token = authHeader.split("Bearer ")[1]
    if (token === process.env.INTERNAL_SECRET) {
      await context.kv.set(
        "topicsWithConnections",
        JSON.stringify(args.topicsWithConnections)
      )
      return "ok"
    }
  } catch (err) {
    console.error(err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
