import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import Stripe from "stripe"
import { upgradeStripeMonthlyPlanToYear } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
  typescript: true
})

// TODO: should use grafbase stripe connector
// https://grafbase.com/docs/connectors
export default async function updateStripePlan(
  root: any,
  args: {},
  context: Context
) {
  console.log("updating stripe plan", { args })
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    try {
      const stripeSubscriptionObjectId =
        await upgradeStripeMonthlyPlanToYear(hankoId)
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
              price: process.env.STRIPE_YEAR_SUBSCRIPTION
            }
          ]
        }
      )
      return "ok"
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }
}
