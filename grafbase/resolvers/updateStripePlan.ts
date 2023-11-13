import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import Stripe from "stripe"
import { upgradeStripeMonthlyPlanToYear } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Resolver } from "@grafbase/generated"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true
})

// TODO: should use grafbase stripe connector
// https://grafbase.com/docs/connectors
const updateStripePlanResolver: Resolver["Mutation.updateStripePlan"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
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
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}

export default updateStripePlanResolver
