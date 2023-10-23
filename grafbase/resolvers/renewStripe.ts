import Stripe from "stripe"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { updateUserRenewedSubscription } from "../edgedb/crud/user"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
  typescript: true
})

export default async function stopCancelStripeResolver(
  root: any,
  args: {},
  context: Context
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    try {
      const stripeSubscriptionObjectId =
        await updateUserRenewedSubscription(hankoId)
      await stripe.subscriptions.update(
        // @ts-ignore
        stripeSubscriptionObjectId?.stripeSubscriptionObjectId,
        {
          cancel_at_period_end: false
        }
      )
      return "ok"
    } catch (error) {
      throw new GraphQLError(JSON.stringify(error))
    }
  }
}
