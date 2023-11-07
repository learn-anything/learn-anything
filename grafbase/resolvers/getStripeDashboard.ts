import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function getStripeDashboardResolver(
  root: any,
  args: { linkId: string },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      // TODO: there is stripe API that returns dashboard showing current subscriptions
      // https://stripe.com/docs/no-code/customer-portal
      // use that API and return it so users can overview their existing subscriptions there
      return ""
    }
  } catch (err) {
    console.error(err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
