import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import Stripe from "stripe"
import { upgradeStripeMonthlyPlanToYear } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
  typescript: true
})

export default async function updateStripePlan(
  root: any,
  args: {},
  context: Context
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    try {
      const stripeSubscriptionObjectId =
        await upgradeStripeMonthlyPlanToYear(hankoId)
      return
      const subscription = await stripe.subscriptions.retrieve(
        // @ts-ignore
        stripeSubscriptionObjectId?.stripeSubscriptionObjectId
      )
      // @ts-ignore
      const subscriptionItemId = subscription.items.data[0].id
      await stripe.subscriptions.update(
        // @ts-ignore
        stripeSubscriptionObjectId?.stripeSubscriptionObjectId,
        {
          items: [
            {
              id: subscriptionItemId,
              price: "price_1O0mgN4soP2HpBfdFkfIl9Bl"
            }
          ]
        }
      )
      return "ok"
    } catch (error) {
      throw new GraphQLError(JSON.stringify(error))
    }
  }
}
