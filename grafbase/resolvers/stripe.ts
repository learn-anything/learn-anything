import Stripe from "stripe"
import { userEmailFromHankoToken } from "../../lib/grafbase/grafbase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
  typescript: true,
})

type StripePlan = "month" | "year"

export default async function StripeResolver(
  root: any,
  args: { plan: StripePlan },
  context: any,
) {
  const email = await userEmailFromHankoToken(context)
  if (email) {
    try {
      console.log("trying to do stripe checkout session")
      switch (args.plan) {
        case "month":
          const monthSubscription = await stripe.checkout.sessions.create({
            success_url: process.env.STRIPE_SUCCESS_URL!,
            mode: "subscription",
            metadata: {
              // userEmail: id,
              subscriptionType: "normal",
            },
            line_items: [
              {
                quantity: 1,
                price: process.env.STRIPE_MONTH_SUBSCRIPTION!,
              },
            ],
          })
          console.log(monthSubscription.url, "URL")
          return {
            stripeCheckoutUrl: monthSubscription.url,
          }
        case "year":
          const yearSubscription = await stripe.checkout.sessions.create({
            success_url: process.env.STRIPE_SUCCESS_URL!,
            mode: "subscription",
            metadata: {
              // userId: id,
              subscriptionType: "normal",
            },
            line_items: [
              {
                quantity: 1,
                price: process.env.STRIPE_YEAR_SUBSCRIPTION!,
              },
            ],
          })
          return {
            stripeCheckoutUrl: yearSubscription.url,
          }
        default:
          return {
            stripeCheckoutUrl: null,
          }
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    console.log("not member")
    return "not member"
  }
}
