import { Hono } from "hono"
import Stripe from "stripe"
import type { Context } from "hono"
import { cors } from "hono/cors"

const app = new Hono()
app.use("*", cors())

app.onError((e, c) => {
  console.log(e.message)
  return c.text("Internal Sever Error", 500)
})

app.post("/learn-anything-bought", async (c: Context) => {
  // console.log(c.env.LA_STRIPE_WEBHOOK_SECRET!, "key..")
  let event = c.req.body
  const stripe = new Stripe(c.env.LA_STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
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
      // @ts-ignore
      console.log(`⚠️  Webhook signature verification failed.`, err.message)
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
        // const subscriptionType =
        //   checkoutSessionCompleted.metadata.subscriptionType.trim()
        // console.log(checkoutSessionCompleted.metadata, "metadata")
        const email = checkoutSessionCompleted.metadata.userEmail.trim()
        // const email = "nikita@nikiv.dev"
        // console.log(email, "email")
        const subscription = await stripe.subscriptions.retrieve(
          checkoutSessionCompleted.subscription,
        )
        // console.log(checkoutSessionCompleted.subscription, "value")
        const endDateInUnix = subscription.current_period_end
        // console.log(endDateInUnix, "end date in unix!")
        // const iso8601_format = new Date(endDateInUnix * 1000)

        const query = `
        mutation InternalUpdateMemberUntilOfUser($email: String!, $memberUntilDateInUnixTime: Int!) {
          internalUpdateMemberUntilOfUser(email: $email, memberUntilDateInUnixTime: $memberUntilDateInUnixTime)
        }
        `

        const variables = {
          email: email,
          memberUntilDateInUnixTime: endDateInUnix,
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

        // const res = await client.querySingle(
        //   `
        //   update User
        //   filter .email = <str>$email
        //   set {
        //     memberUntil:= <datetime>$iso8601_format
        //   }
        // `,
        //   { email, iso8601_format },
        // )
        // console.log(res, "res")
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
      // Unexpected event type
      // TODO: log?
      // @ts-ignore
      console.log(`Unhandled event type`)
      return c.json({ error: `Unhandled event type` })
  }
  return c.json({})
})

export default app
