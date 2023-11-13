import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import Stripe from "stripe"
import { updateUserStoppedSubscription } from "../edgedb/crud/user"
import { hankoIdFromToken } from "../lib/hanko-validate"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true
})

const cancelStripeResolver: Resolver["Mutation.cancelStripe"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const stripeSubscriptionObjectId =
        await updateUserStoppedSubscription(hankoId)
      await stripe.subscriptions.update(
        // @ts-ignore
        stripeSubscriptionObjectId?.stripeSubscriptionObjectId,
        {
          cancel_at_period_end: true
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

export default cancelStripeResolver
