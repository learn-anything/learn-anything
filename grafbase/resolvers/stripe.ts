import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
  typescript: true,
})

type StripePlan = "month" | "year"

export default async function Resolver(
  { id }: any,
  { plan }: { plan: StripePlan },
) {
  try {
    switch (plan) {
      case "month":
        const monthSubscription = await stripe.checkout.sessions.create({
          success_url: process.env.STRIPE_SUCCESS_URL!,
          mode: "subscription",
          metadata: {
            userId: id,
            subscriptionType: "normal",
          },
          line_items: [
            {
              quantity: 1,
              price: process.env.STRIPE_MONTH_SUBSCRIPTION!,
            },
          ],
        })
        return {
          stripeCheckoutUrl: monthSubscription.url,
        }
      case "year":
        const yearSubscription = await stripe.checkout.sessions.create({
          success_url: process.env.STRIPE_SUCCESS_URL!,
          mode: "subscription",
          metadata: {
            userId: id,
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
}
