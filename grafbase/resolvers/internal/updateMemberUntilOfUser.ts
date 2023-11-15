import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { updateMemberUntilOfUser } from "../../edgedb/crud/user"

const updateMemberUntilOfUserResolver: Resolver["Mutation.internalUpdateMemberUntilOfUser"] =
  async (parent, args, context, info) => {
    try {
      const authHeader = context.request.headers["authorization"]
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
      const token = authHeader.split("Bearer ")[1]
      if (token === process.env.INTERNAL_SECRET) {
        await updateMemberUntilOfUser(
          args.email,
          args.memberUntilDateInUnixTime,
          args.stripeSubscriptionObjectId,
          args.stripePlan
        )
        return "ok"
      }
      {
        throw new GraphQLError("Missing or invalid Authorization header")
      }
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default updateMemberUntilOfUserResolver
