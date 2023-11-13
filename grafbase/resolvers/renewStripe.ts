import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import Stripe from "stripe"
import { updateUserRenewedSubscription } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true
})

const stopCancelStripeResolver: Resolver["Mutation.renewStripe"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
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
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}

export default stopCancelStripeResolver
