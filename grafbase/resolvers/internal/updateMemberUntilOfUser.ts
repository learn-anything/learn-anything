import { GraphQLError } from "graphql"
import { Context } from "@grafbase/sdk"
import { updateMemberUntilOfUser } from "../../edgedb/crud/user"

export default async function updateMemberUntilOfUserResolver(
  root: any,
  args: { email: string; memberUntilDateInUnixTime: number; secret: string },
  context: Context
) {
  try {
    const authHeader = context.request.headers["authorization"]
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
    const token = authHeader.split("Bearer ")[1]
    if (token === process.env.INTERNAL_SECRET) {
      await updateMemberUntilOfUser(args.email, args.memberUntilDateInUnixTime)
      return "ok"
    }
  } catch (err) {
    console.log(err, "err")
    throw new GraphQLError(JSON.stringify(err))
  }
}
