This is a webhook endpoint that listens in to events from Stripe and does things.

Currently it triggers when a person bought membership to LA. It checks the time frame (month/year) and then updates the `User` object with `memberUntil` property set to the date until membership is valid.

## Test Stripe events locally

Assumes you are logged in with `stripe login`.

Then run this in 1 tab: `stripe listen --forward-to localhost:8787/learn-anything-bought`

And this in another tab: `bun dev`

You can then run `stripe trigger checkout.session.completed` in another tab to trigger `checkout.session.completed` event.

However it is best not to do `stripe trigger checkout.session.completed` but instead create a product in Stripe dashboard in dev mode. And in dev mode do a payment link ther. As you have `stripe listen --forward-to localhost:8787/learn-anything-bought` running, requests will go to your local server. This is the best way to test Stripe payments as all metadata and things will be correct.

Check logs in server (from `bun run` command) for errors.

[Use incoming webhooks to get real-time updates](https://stripe.com/docs/webhooks) is a good read.

## Deploy production

```
bun run deploy
```

## Deploy staging

```
bun run deploy:staging
```
