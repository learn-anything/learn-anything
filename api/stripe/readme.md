This is a webhook endpoint that listens in to events from Stripe and does things.

Currently it triggers when a person bought membership to LA. It checks the time frame (month/year) and then updates the `User` object with `memberUntil` property set to the date until membership is valid.

# Run

## Test Stripe events locally

Assumes you are logged in with `stripe login`.

Then run this in 1 tab: `stripe listen --forward-to localhost:8787/learn-anything-bought`

And this in another tab: `bun dev`

You can then run `stripe trigger checkout.session.completed` in another tab to trigger `checkout.session.completed` event.

And check logs in server (from `bun run` command)

[Use incoming webhooks to get real-time updates](https://stripe.com/docs/webhooks) is a good read.

## Deploy

```
bun deploy --name stripe --keep-vars
```
