# [learn-anything.xyz](https://learn-anything.xyz)

> Organize world's knowledge, explore connections and curate learning paths

## Files

- [lib](lib) - shared functions
- [scripts](scripts) - utility scripts
- [web](web) - website hosted on [learn-anything.xyz](https://learn-anything.xyz) (using [React](https://react.dev/), [TanStack Start](https://tanstack.com/start/latest), [Jazz](https://jazz.tools/))

> [!NOTE]
> Other folders present in repo are in non stable state.

<!-- TODO: make the folders stable/runnable and add them to `Files` -->
<!-- - [api](api) - http services (using TS/[Encore](https://encore.dev/)) -->
<!-- - [app](app) - desktop app (wrapping the [website](web) with desktop specific logic) (using [Tauri](https://v2.tauri.app/)) -->
<!-- - [cli](cli) - cli (using [Go](https://go.dev)) -->
<!-- - [docs](https://github.com/learn-anything/docs) - public docs hosted on [docs.learn-anything.xyz](https://docs.learn-anything.xyz/) -->
<!-- - [nix](nix) - shared nix code -->

## Setup

> [!NOTE]
> Project is currently in unstable state for contributions but actively improving. Reach out on [Discord](https://discord.gg/bxtD8x6aNF) for help.

Using [Bun](https://bun.sh):

```
bun i
```

> [!NOTE]
> bun setup is not yet done but will be a command to fully bootstrap a local working env for the project, without it, running `bun web` is impossible yet

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

Currently the way to get them is to message to us on [Discord](https://discord.gg/bxtD8x6aNF) (this will be improved).

## Run website

```
bun web
```

## Contributing

If you want to help contribute to code, ask for help on [Discord](https://discord.gg/bxtD8x6aNF)'s [#dev channel](https://discord.com/channels/428579844046192640/1171861795867209798). You will be onboarded and unblocked fast.

Can see [existing issues](../../issues) for things being worked on.

Can [open new issue](../../issues/new/choose) (search existing ones for duplicates first) or start discussion on [GitHub](../../discussions) or [Discord](https://discord.gg/bxtD8x6aNF).

Can always submit draft PRs with good ideas/fixes. We will help along the way to make it merge ready.

## Join core team

We are a small team of core developers right now but are always looking to expand. We will reach out with offer to join us if you contribute to repo in form of PRs. Can also contact us via [email](mailto:join@learn-anything.xyz).

[![Discord](https://img.shields.io/badge/Discord-100000?style=flat&logo=discord&logoColor=white&labelColor=black&color=black)](https://discord.com/invite/bxtD8x6aNF) [![X](https://img.shields.io/badge/learnanything-100000?logo=X&color=black)](https://x.com/learnanything_)
