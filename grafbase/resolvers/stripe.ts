import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import Stripe from "stripe"
import { hankoIdFromToken } from "../lib/hanko-validate"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true
})

// TODO:
// @ts-ignore
const StripeResolver: Resolver["Query.stripe"] = async (
  parent,
  args,
  context,
  info
) => {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      switch (args.plan) {
        case "month":
          const monthSubscription = await stripe.checkout.sessions.create({
            success_url: process.env.STRIPE_SUCCESS_URL!,
            mode: "subscription",
            metadata: {
              userEmail: args.userEmail
            },
            line_items: [
              {
                quantity: 1,
                price: process.env.STRIPE_MONTH_SUBSCRIPTION!
              }
            ]
          })
          return monthSubscription.url
        case "year":
          const yearSubscription = await stripe.checkout.sessions.create({
            success_url: process.env.STRIPE_SUCCESS_URL!,
            mode: "subscription",
            metadata: {
              userEmail: args.userEmail
            },
            line_items: [
              {
                quantity: 1,
                price: process.env.STRIPE_YEAR_SUBSCRIPTION!
              }
            ]
          })
          return yearSubscription.url
        default:
          return {
            stripeCheckoutUrl: null
          }
      }
    } else {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
  } catch (err) {
    console.error(err)
    throw new GraphQLError(JSON.stringify(err))
  }
}
