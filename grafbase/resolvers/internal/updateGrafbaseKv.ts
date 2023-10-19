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
      console.log(JSON.stringify(args.topicsWithConnections), "test")
      await context.kv.set(
        "topicsWithConnections",
        JSON.stringify(args.topicsWithConnections)
      )
      return "ok"
    }
  } catch (err) {
    console.log(err, "err")
    throw new GraphQLError(JSON.stringify(err))
  }
}
