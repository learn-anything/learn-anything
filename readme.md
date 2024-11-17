# [learn-anything.xyz](https://learn-anything.xyz)

> Organize world's knowledge, explore connections and curate learning paths

### Files

- [web](web) - website hosted on [learn-anything.xyz](https://learn-anything.xyz) (using [React](https://react.dev/), [TanStack Start](https://tanstack.com/start/latest), [Jazz](https://jazz.tools/))

## Setup

> [!NOTE]
> Project is currently in unstable state for contributions but actively improving. Reach out on [Discord](https://discord.gg/bxtD8x6aNF) for help.

Using [Bun](https://bun.sh):

```
bun i
```

> [!NOTE]
> bun setup is not yet done but will be a command to fully bootstrap a local working env for the project

```
bun setup
```

You need to have this `web/.env` in order to run the website:

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

Currently the way to get them is to message us on [Discord](https://discord.gg/bxtD8x6aNF) (this will be improved/automated).

## Run website

```
bun web
```

## Contributing

Always open to useful ideas or fixes in form of issues or PRs.

Can [open new issue](../../issues/new/choose) (search [existing ones](../../issues) for duplicates first) or start discussion on [GitHub](../../discussions) or [Discord](https://discord.gg/bxtD8x6aNF).

Can submit draft PRs with good ideas/fixes. You will get help along the way to make it merge ready.

Ask for help on [Discord](https://discord.gg/bxtD8x6aNF)'s [#dev channel](https://discord.com/channels/428579844046192640/1171861795867209798). You will be onboarded and unblocked fast.

## Join core team

We are a small team of core developers right now but are always looking to expand. We will reach out with offer to join us if you contribute to repo in form of PRs or fruitful issues/discussions. Can also contact us via [email](mailto:join@learn-anything.xyz).

[![Discord](https://img.shields.io/badge/Discord-100000?style=flat&logo=discord&logoColor=white&labelColor=black&color=black)](https://discord.com/invite/bxtD8x6aNF) [![X](https://img.shields.io/badge/learnanything-100000?logo=X&color=black)](https://x.com/learnanything_)
