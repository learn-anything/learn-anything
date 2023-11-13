import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"

const getStripeDashboardResolver: Resolver["Query.getStripeDashboard"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      // TODO: there is stripe API that returns dashboard showing current subscriptions
      // https://stripe.com/docs/no-code/customer-portal
      // use that API and return it so users can overview their existing subscriptions there
      return ""
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}

export default getStripeDashboardResolver
