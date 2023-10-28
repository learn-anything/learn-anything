import { Hono } from "hono"
import Stripe from "stripe"
import type { Context } from "hono"
import { cors } from "hono/cors"

const app = new Hono()
app.use("*", cors())

app.onError(async (e, c) => {
  await logError(e.message, "error in hono")
  return c.text("Internal Sever Error", 500)
})

app.post("/learn-anything-bought", async (c: Context) => {
  // TODO: test https://discord.com/channels/1011308539819597844/1011308539819597847/1167292883758489640
  // maybe its better? below seems to work too though
  let event = await c.req.parseBody()
  const stripe = new Stripe(c.env.LA_STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
    typescript: true,
  })
  const endpointSecret = c.env.LA_STRIPE_WEBHOOK_SECRET!
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = c.req.header("stripe-signature")
    const textBody = await c.req.text()
    try {
      // @ts-ignore
      event = await stripe.webhooks.constructEventAsync(
        textBody,
        signature!,
        endpointSecret,
      )
    } catch (err) {
      await logError(err, "Webhook signature verification failed")
      c.status(400)
      return c.json({ err: "failed" })
    }
  }

  // Handle the event
  // @ts-ignore
  switch (event.type) {
    case "checkout.session.completed":
      // @ts-ignore
      const checkoutSessionCompleted = event.data.object
      if (checkoutSessionCompleted.status === "complete") {
        const email = checkoutSessionCompleted.metadata.userEmail.trim()
        const subscription = await stripe.subscriptions.retrieve(
          checkoutSessionCompleted.subscription,
        )
        const endDateInUnix = subscription.current_period_end
        const priceID = subscription.items.data[0].price.id

        const query = `
        mutation InternalUpdateMemberUntilOfUser($email: String!, $memberUntilDateInUnixTime: Int!, $stripeSubscriptionObjectId: String!, $stripePlan: String!) {
          internalUpdateMemberUntilOfUser(email: $email, memberUntilDateInUnixTime: $memberUntilDateInUnixTime, stripeSubscriptionObjectId: $stripeSubscriptionObjectId, stripePlan: $stripePlan)
        }
        `

        const variables = {
          email: email,
          memberUntilDateInUnixTime: endDateInUnix,
          stripeSubscriptionObjectId: subscription.id,
          stripePlan: priceID === c.env.LA_MONTH_PRICE_ID! ? "month" : "year",
        }

        // TODO: check for errors, show in ui if error happens
        await fetch(c.env.GRAFBASE_API_URL!, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${c.env.INTERNAL_SECRET!}`,
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        })
        return c.json({ success: `memberUntil value is updated` })
      }
      break
    // TODO: cover case where users update their subscription
    // case "customer.subscription.updated":
    //   // @ts-ignore
    //   let customerSubscriptionUpdated = event.data.object
    //   break

    // TODO: check if subscription is canceled or something
    // TODO: log it
    // const sessions = await stripe.checkout.sessions.list({
    //   subscription: customerSubscriptionUpdated.ID,
    // })
    default:
      await logError(event, "Unhandled event type")
      return c.json({ error: `Unhandled event type` })
  }
  return c.json({})
})

export default app

export async function log(
  message: any,
  additionalMessage?: string | Record<string, any>,
) {
  if (ENV !== "prod" && ENV !== "staging") {
    console.log(message, additionalMessage)
    return
  }
  let url
  if (ENV === "staging") {
    url = `https://events.baselime.io/v1/staging-stripe/events/logs`
  } else {
    url = `https://events.baselime.io/v1/stripe/events/logs`
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.BASELIME_API_KEY!,
    },
    body: JSON.stringify([{ message, additionalMessage }]),
  }
  await fetch(url, requestOptions)
}

export async function logError(
  error: any,
  additionalMessage?: string | Record<string, any>,
) {
  if (ENV !== "prod" && ENV !== "staging") {
    console.error(error, additionalMessage)
    return
  }
  let url
  if (ENV === "staging") {
    url = `https://events.baselime.io/v1/staging-stripe/events/errors`
  } else {
    url = `https://events.baselime.io/v1/stripe/events/errors`
  }

  if (typeof error === "object") {
    error = Object.assign(
      {
        message: error.message,
        stack: error.stack,
      },
      error,
    )
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.BASELIME_API_KEY!,
    },
    body: JSON.stringify([{ error, additionalMessage }]),
  }
  await fetch(url, requestOptions)
}
