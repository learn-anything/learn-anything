# [Learn-Anything.xyz](https://learn-anything.xyz)

> Organize world's knowledge, explore connections and curate learning paths

<!-- See [learn-anything.xyz/about](https://learn-anything.xyz/about) for what problems LA is trying to solve. -->

###### Contents

- [File structure](#file-structure) - make sense of how code is laid out in the repo
- [Setup](#setup) - get started with development
  - [Setup EdgeDB](#setup-edgedb)
- [Run GraphQL server (Grafbase)](#run-graphql-server-grafbase)
- [Run website (Solid)](#run-website-solid)
- [Run desktop app (Tauri/Rust)](#run-desktop-app-taurirust)
- [Contribute](#contribute) - contribute to project effectively
- [Docs](#docs)
- [Commands](#commands)

Current tasks to do are in [todo.md](todo.md) (sorted by priority).

Ask questions on [Discord](https://discord.com/invite/bxtD8x6aNF) if interested in developing the project or you get issues with setup.

## File structure

Tech stack is described in [docs/tech-stack.md](docs/tech-stack.md).

- [app](app) - desktop app in Tauri/Solid
- [docs](docs) - all the docs
- [grafbase](grafbase) - [Grafbase](https://grafbase.com/) provides GraphQL API layer for all server functions like talking with DB
  - [edgedb](grafbase/edgedb) - [EdgeDB](https://www.edgedb.com/) used as main server database
    - [dbschema](grafbase/edgedb/dbschema)
      - [default.esdl](grafbase/edgedb/dbschema/default.esdl) - [EdgeDB schema](https://www.edgedb.com/docs/intro/schema) defining all the models and relations
      - [migrations](grafbase/edgedb/dbschema/migrations) - migration files get generated after running `bun db:migrate`
    - [client.ts](grafbase/edgedb/client.ts) - exports client to connect with EdgeDB
    - [topic.ts](grafbase/edgedb/topic.ts) / [user.ts](api/edgedb/user.ts) - CRUD functions on models
  - [resolvers](grafbase/resolvers) - [edge resolvers](https://grafbase.com/docs/edge-gateway/resolvers) are server functions exposed with GraphQL
  - [grafbase.config.ts](grafbase/grafbase.config.ts) - [Grafbase's config](https://grafbase.com/docs/config)
- [packages](packages) - shared TS packages
- [website](website) - learn-anything.xyz website code in Solid
  - [components](website/components) - solid components
  - [routes](website/src/routes) - routes defined using file system

## Setup

Everything is driven using [bun](https://bun.sh) commands as part of monorepo setup using [bun workspaces](https://bun.sh/docs/install/workspaces).

First run:

```
bun i
bun dev-setup
```

`bun dev-setup` will `git clone` [seed repo](https://github.com/learn-anything/seed). It's needed for some commands below to work.

### Setup EdgeDB

> **Warning**
> Instructions might break, will be reviewed before first LA public release

Install EdgeDB by running `curl ..` command from [EdgeDB](https://www.edgedb.com) website. It is used as main server database.

Then run:

```
bun db:init
```

Follow instructions, name EdgeDB instance `learn-anything`.

Run `bun db:ui`. This will open EdgeDB graphical interface where you can run queries or explore the schema.

Then in `grafbase/.env`, set:

```
LOCAL=true
EDGEDB_DSN=
```

Where `EDGEDB_DSN` value comes from running `bun db:get-dsn`.

#### Generate edgedb-js bindings

```
bun db:ts-generate
```

This gives you type safe access to EdgeDB and lets you use the query builder nicely.

#### Seed EdgeDB with content

> **Warning**
> Instructions need to be added + tested

Goal is to be able to run something like `bun db:seed` and it will preload local EdgeDB instance will all the necessary data.

Coming from [seed repo](https://github.com/learn-anything/seed).

## Run GraphQL server (Grafbase)

> **Warning**
> Instructions might break, will be reviewed before first LA public release

Assumes you followed instructions for [Setup EdgeDB](setup-edgedb) and have `grafbase/.env` file with:

```
LOCAL=true
EDGEDB_DSN=edgedb://
```

Then run:

```
npx grafbase@latest dev
```

> **Note**
> Ideally [bunx](https://bun.sh/docs/cli/bunx) is used but `bun api` [fails to run](https://github.com/oven-sh/bun/issues/5552)

This starts Grafbase locally and give you GraphQL access.

Download [Pathfinder](https://pathfinder.dev/) app and open http://localhost:4000. Can also open it in browser. In there, you can run various queries.

In short, [Grafbase config](https://grafbase.com/docs/config) is set in [grafbase/grafbase.config.ts](grafbase/grafbase.config.ts). You specify what [resolvers](https://grafbase.com/docs/edge-gateway/resolvers) are defined, what inputs/outputs they have. Then you create or edit files in [grafbase/resolvers](grafbase/resolvers). Read existing resolvers to make sense of how it works.

## Run website (Solid)

> **Warning**
> Instructions might break, will be reviewed before first LA public release

<!-- TODO: automate creating of `.env` file with default content as part of `bun setup` command -->
<!-- TODO: do same for API .env too -->

Create `.env` file inside [website](app/packages/website) with this content:

```
VITE_HANKO_API=https://e879ccc9-285e-49d3-b37e-b569f0db4035.hanko.io
API_OF_GRAFBASE=http://127.0.0.1:4000/graphql
```

[Hanko](https://www.hanko.io/) is used as auth provider. You can swap Hanko API variable content with one from a project you create yourself.

Run:

```
bun web
```

Open http://localhost:3000

## Run desktop app (Tauri/Rust)

> **Warning**
> Instructions will be added after website works properly

```
bun app
```

<!-- ### Useful DevTools panel

In the app you get after running `bun app`, you will see DevTools panel in bottom right corner. It contains a list of useful actions you can run to aid you.

One of the actions is `Seed TinyBase`. This will seed your local TinyBase store/sqlite with [one of the wikis](https://github.com/learn-anything/seed/tree/main/wiki/nikita) in seed folder.

Read [app/packages/preload/src/index.ts](app/packages/preload/src/index.ts) file for details. `syncWikiFromSeed` is the function. -->

<!-- ## Run mobile app

> WIP -->

<!-- ## Test

> below tests are in TS, only relevant now to help migration to rust

```
bun test
```

Will run tests found in [test](test).

[test/wiki.test.ts](test/wiki.test.ts) file tests markdown file parsing.

Running code via tests is very effective. You can open terminal on your right and edit code on the left and on each `.ts` file save it will rerun the test and check if behavior you are testing is correct. Reading through the test suite is great way to understand the backend part of the app.

You can point the tests at your own wiki/notes folder too. Put the folder with files into seed/test folder you get from running `bun dev-setup` -->

## Contribute

Current tasks to do are in [todo.md](todo.md) (sorted by priority).

If task/bug is not mentioned there, open a GitHub issue or start a discussion.

Join [Discord](https://discord.com/invite/bxtD8x6aNF) to get any help you need to make your contribution.

All PRs with improvements to docs/code or contributions to existing discussions/issues are welcome.

## Docs

All docs can be seen in [docs](docs).

It is advisable you read them, before you start developing anything as they try give a lot of context and general knowledge.

There is big focus on documentation and clarity in the project. All code should be clear and understandable and well documented.

Check [docs/dev-tips.md](docs/dev-tips.md) for some advice on development.

## Commands

Ran with `bun <Name>`

| Name           | Command                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| seed-clone     | git clone https://github.com/learn-anything/seed                                                      |
| seed-update    | cd seed && git pull                                                                                   |
| dev-setup      | bun seed-clone                                                                                        |
| app            | cd app && bun tauri:dev                                                                               |
| web            | cd website && bun dev                                                                                 |
| web:build      | cd website && solid-start build                                                                       |
| web:start      | cd website && solid-start start                                                                       |
| db             | cd edgedb && tput reset && bun --watch cli/cli.ts                                                     |
| db:init        | cd edgedb && edgedb project init                                                                      |
| db:ui          | cd edgedb && edgedb ui                                                                                |
| db:watch       | cd edgedb && edgedb watch                                                                             |
| db:migrate     | cd edgedb && edgedb migration create && edgedb migrate && bunx @edgedb/generate edgeql-js --target ts |
| db:ts-generate | cd edgedb && bunx @edgedb/generate edgeql-js --target ts                                              |
| api            | bunx grafbase@latest dev                                                                              |
| api:codegen    | graphql-codegen                                                                                       |
| ts             | tput reset && bun --watch run.ts                                                                      |
| test-rust-wiki | cd app/src-tauri/crates/wiki/ && cargo watch -q -- sh -c "tput reset && cargo test -q --lib"          |

### ♥️

[![MIT](http://bit.ly/mitbadge)](https://choosealicense.com/licenses/mit/) [![Twitter](http://bit.ly/latwitt)](https://twitter.com/learnanything_)
