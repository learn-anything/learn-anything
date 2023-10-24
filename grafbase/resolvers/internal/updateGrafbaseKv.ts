import { GraphQLError } from "graphql"
import { Context } from "@grafbase/sdk"

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
    console.log(JSON.stringify(err), "err")
    throw new GraphQLError(JSON.stringify(err))
  }
}
