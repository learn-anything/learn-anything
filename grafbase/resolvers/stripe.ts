import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import Stripe from "stripe"
import { hankoIdFromToken } from "../lib/hanko-validate"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true
})

type StripePlan = "month" | "year"

export default async function StripeResolver(
  root: any,
  args: { plan: StripePlan; userEmail: string },
  context: Context
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    try {
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
    } catch (err) {
      console.error(err, { args })
      throw new GraphQLError(JSON.stringify(err))
    }
  } else {
    console.error("not a member", { args })
    throw new GraphQLError("not member")
  }
}
