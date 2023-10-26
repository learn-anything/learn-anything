import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import Stripe from "stripe"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { log, logError } from "../lib/baselime"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2023-08-16",
//   typescript: true
// })

type StripePlan = "month" | "year"

export default async function StripeResolver(
  root: any,
  args: { plan: StripePlan; userEmail: string },
  context: Context
) {
  log("stripe", "trying to get stripe checkout", { args })
  console.log("log test")
  console.log(process.env.STRIPE_SECRET_KEY!, "stripe secret key")
  console.log(process.env.BASELIME_API_KEY!, "baselime api key")
  // return "ok"
  // const hankoId = await hankoIdFromToken(context)
  // if (hankoId) {
  //   try {
  //     switch (args.plan) {
  //       case "month":
  //         const monthSubscription = await stripe.checkout.sessions.create({
  //           success_url: process.env.STRIPE_SUCCESS_URL!,
  //           mode: "subscription",
  //           metadata: {
  //             userEmail: args.userEmail
  //           },
  //           line_items: [
  //             {
  //               quantity: 1,
  //               price: process.env.STRIPE_MONTH_SUBSCRIPTION!
  //             }
  //           ]
  //         })
  //         return monthSubscription.url
  //       case "year":
  //         const yearSubscription = await stripe.checkout.sessions.create({
  //           success_url: process.env.STRIPE_SUCCESS_URL!,
  //           mode: "subscription",
  //           metadata: {
  //             userEmail: args.userEmail
  //           },
  //           line_items: [
  //             {
  //               quantity: 1,
  //               price: process.env.STRIPE_YEAR_SUBSCRIPTION!
  //             }
  //           ]
  //         })
  //         return yearSubscription.url
  //       default:
  //         return {
  //           stripeCheckoutUrl: null
  //         }
  //     }
  //   } catch (error) {
  //     logError("stripe", error, { args })
  //     throw new GraphQLError(JSON.stringify(error))
  //   }
  // } else {
  //   logError("stripe", "not a member", { args })
  //   throw new GraphQLError("not member")
  // }
}
