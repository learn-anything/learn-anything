> [!WARNING]
> Setup is not tuned for OSS contributions, specifically getting the `.env` is tricky, it will be improved

> [!NOTE]
> Reach out on [Discord](https://discord.gg/bxtD8x6aNF) for help if things fail in setup/dev

## Setup

Need this `.env`:

```
### ALL

RONIN_TOKEN=

### DEV

VITE_APP_NAME="Learn Anything"
VITE_APP_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
VITE_JAZZ_PEER_URL=
VITE_JAZZ_GLOBAL_GROUP_ID=

CLERK_SECRET_KEY=
```

`CLERK_` come from [Clerk](https://clerk.com) workspace. `VITE_JAZZ_` comes from [Jazz](https://jazz.tools/).

```
bun i
```

## Run

```
bun dev
```

## Stack

- [TanStack Start](https://tanstack.com/start/latest) - react framework (routing, server actions, ..)
- [Jazz](https://jazz.tools) - local/server state (sync engine)
- [Clerk](https://clerk.com) - auth
