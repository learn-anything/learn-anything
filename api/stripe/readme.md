# Run

```
bun dev
```

## Stripe login

```
stripe login
```

## Start local stripe webhook tester

```
stripe listen --forward-to localhost:4242/learn-anything-bought
```

## Emulate checkout session completed

```
stripe trigger checkout.session.completed
```

Then check the logs in the server.

## Deploy

```
bun deploy --name stripe --keep-vars
```
