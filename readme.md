# [Learn-Anything.xyz](https://learn-anything.xyz)

> Organize world's knowledge, explore connections and curate learning paths

The end goal of Learn Anything is to become the best place and tool for keeping track of what you know. What ideas you have. What you want to learn next. What you don't know yet. And how you can learn that in the most optimal way possible given what you know already.

[Try the website yourself first to get a feel for it](https://learn-anything.xyz).

It is a fully open source project with an active community on [Discord](https://discord.com/invite/bxtD8x6aNF). There is great focus on both DX of developing everything LA and even more, the end user UX.

Project as it stands is a website and a desktop app. There is also [mobile app](https://github.com/learn-anything/mobile) in works currently in separate repo. We plan to train our own LLMs as we provide AI interfaces to all things knowledge, be it global AGI level queries ala ChatGPT or [querying into any person's knowledge base](https://github.com/learn-anything/ai) with different levels of privacy.

There is more exciting projects planned and under way (like [digital idea/goods marketplace with solana support](https://github.com/learn-anything/buy)). If interested, read on to setup the project and start writing your first code. ♥️

###### Contents

- [File structure](#file-structure) - make sense of how code is laid out in the repo
- [Setup](#setup) - get started with development
  - [Setup EdgeDB](#setup-edgedb)
    - [Generate edgedb-js bindings](#generate-edgedb-js-bindings)
    - [Seed EdgeDB with content](#seed-edgedb-with-content)
- [Run GraphQL server (Grafbase)](#run-graphql-server-grafbase)
- [Run website (Solid)](#run-website-solid)
- [Run desktop app (Tauri/Rust)](#run-desktop-app-taurirust)
- [Contribute](#contribute) - contribute to project effectively
- [Docs](#docs)
- [Commands](#commands)

Current tasks to do are in [todo.md](todo.md) (sorted by priority). Will be migrated to GitHub issues soon. As aside there is work being done too to make [KusKus](https://github.com/kuskusapp/kuskus) be the GitHub issues client that will be recommended to keep track of issues being worked on. Can join development of that too if you like.

Do join [Discord](https://discord.com/invite/bxtD8x6aNF) and ask questions. Any issues with setup or making your first feature or trying to fix a bug will be resolved asap. Same goes for discussing ideas on how to make the tool even better than it is now.

## File structure

Tech stack is described in [docs/tech-stack.md](docs/tech-stack.md).

- [app](app) - desktop app in Tauri/Solid
- [docs](docs) - all the docs
- [grafbase](grafbase) - [Grafbase](https://grafbase.com/) provides GraphQL API layer for all server functions like talking with database
  - [edgedb](grafbase/edgedb) - [EdgeDB](https://www.edgedb.com/) used as main server database
    - [dbschema](grafbase/edgedb/dbschema)
      - [default.esdl](grafbase/edgedb/dbschema/default.esdl) - [EdgeDB schema](https://www.edgedb.com/docs/intro/schema) defining all the models and relations
      - [migrations](grafbase/edgedb/dbschema/migrations) - migration files get generated after running `bun db:migrate`
    - [crud](grafbase/edgedb/crud) - CRUD functions on models (imported either from grafbase resolvers or from [cli](grafbase/edgedb/cli/))
  - [resolvers](grafbase/resolvers) - [edge resolvers](https://grafbase.com/docs/edge-gateway/resolvers) are server functions exposed with GraphQL
  - [grafbase.config.ts](grafbase/grafbase.config.ts) - [Grafbase's config](https://grafbase.com/docs/config). You create file in resolvers folder, then extend grafbase.config.ts. Can use [Pathfinder](https://pathfinder.dev) to test query. Then call it from anywhere using some GraphQL client.
- [packages](packages) - shared TS packages
- [website](website) - learn-anything.xyz website code in Solid
  - [components](website/components) - solid components
  - [routes](website/src/routes) - routes defined using file system

## Setup

Everything is driven using [bun](https://bun.sh) commands as part of monorepo setup using [bun workspaces](https://bun.sh/docs/install/workspaces).

First run:

```
bun i
bun setup
```

`bun setup` runs `bun setup.ts init` (can see [setup.ts](setup.ts) code for what it does). It will create `.env` files for you so you can start coding the project fast. It will also `git clone` [seed repo](https://github.com/learn-anything/seed). Which contains various files needed to bootstrap the database with content.

Running `bun setup:full` will clone [ai](https://github.com/learn-anything/ai), [mobile](https://github.com/learn-anything/mobile) and [buy](https://github.com/learn-anything/buy) codebases so you can work with them as one monorepo. Tooling for that will get better with time.

### Setup EdgeDB

> **Warning**
> Instructions might break, if you get an unexpected error or anything, reach out on [Discord](https://discord.com/invite/bxtD8x6aNF), we will resolve it

Install EdgeDB by running `curl ..` command from [EdgeDB](https://www.edgedb.com) website. It is used as main server database. Should be below command for Linux/Mac:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.edgedb.com | sh
```

Then run:

```
bun db:init
```

Follow instructions, name EdgeDB instance `learn-anything`.

Run `bun db:ui`. This will open EdgeDB graphical interface where you can run queries or explore the schema.

If you ran `bun setup`, you should have already a `grafbase/.env` file with this content:

```
LOCAL=true
EDGEDB_DSN=
PUBLIC_HANKO_API_URL=https://e879ccc9-285e-49d3-b37e-b569f0db4035.hanko.io
INTERNAL_SECRET=secret
```

Fill `EDGEDB_DSN` value with value you get from running `bun db:get-dsn`. It's needed to connect to EdgeDB locally.

#### Generate edgedb-js bindings

```
bun db:migrate
```

This gives you type safe access to EdgeDB and lets you use the query builder nicely.

#### Seed EdgeDB with content

> **Warning**
> Below command is incomplete and needs testing, please reach out on [Discord](https://discord.com/invite/bxtD8x6aNF) and we do it together with you

```
bun db:seed
```

Above command is incomplete but will be soon. It should take the files you got in [seed folder](https://github.com/learn-anything/seed) (after running `bun dev-setup`) and fill EdgeDB db with content necessary to develop LA very fast.

Reach out on [Discord](https://discord.com/invite/bxtD8x6aNF) to get a semi working version of the command. ♥️

## Run GraphQL server (Grafbase)

> **Warning**
> If you reach any problems with setup, reach out on [Discord](https://discord.com/invite/bxtD8x6aNF)

Assumes you followed instructions for [Setup EdgeDB](setup-edgedb) and have `grafbase/.env` file with:

```
LOCAL=true
EDGEDB_DSN=edgedb://
PUBLIC_HANKO_API_URL=https://e879ccc9-285e-49d3-b37e-b569f0db4035.hanko.io
INTERNAL_SECRET=secret
```

Then run:

```
npx grafbase@latest dev
```

This starts Grafbase locally and give you GraphQL access.

Download [Pathfinder](https://pathfinder.dev/) app and open http://localhost:4000 inside. Can also open http://localhost:4000 in browser but Pathfinder is nice app. In there, you can run various queries calling resolvers defined in [grafbase/resolvers](grafbase/resolvers). Grafbase picks up any changes you make to the files in the folder.

[Grafbase config](https://grafbase.com/docs/config) is set in [grafbase/grafbase.config.ts](grafbase/grafbase.config.ts). You specify what [resolvers](https://grafbase.com/docs/edge-gateway/resolvers) are defined, what inputs/outputs they have. Then you create or edit files in [grafbase/resolvers](grafbase/resolvers). Read existing resolvers to make sense of how it works.

## Run website (Solid)

> **Warning**
> If you reach any problems with setup, reach out on [Discord](https://discord.com/invite/bxtD8x6aNF)

If you ran `bun setup` before, you should have `website/.env` file with this content:

```
VITE_HANKO_API=https://e879ccc9-285e-49d3-b37e-b569f0db4035.hanko.io
VITE_GRAFBASE_API_URL=http://127.0.0.1:4000/graphql
VITE_GRAFBASE_INTERNAL_SECRET=secret
```

[Hanko](https://www.hanko.io/) is used as auth provider. You can swap Hanko API variable content with one from a project you create yourself. Above is project we made for local dev you can use.

Run:

```
bun web
```

Open http://localhost:3000

> **Warning**
> You need to make sure you have data in the database to actually develop. So do section `Seed EdgeDB with content`. Reach out on [Discord](https://discord.com/invite/bxtD8x6aNF) for help as things are unstable still.

## Run desktop app (Tauri/Rust)

> **Warning**
> WIP, massive effort is put here after website is released and is working without issues

Goal of desktop app is to be essentially a clone of [Obsidian](https://obsidian.md/)/[Reflect](https://reflect.app) (working with local markdown files). And with ability to publish the markdown content to LA. All private data and files will be end to end encrypted and synced with [mobile app](https://github.com/learn-anything/mobile).

It will be the best note taking experience you can get. All open source.

```
bun app
```

> **Warning**
> WIP, Above command will give you issues most likely, reach out on [Discord](https://discord.com/invite/bxtD8x6aNF) and we will help resolve them

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

Current tasks to do are in [todo.md](todo.md) (sorted by priority). Will be organised much better with GitHub issues very soon.

If task/bug is not mentioned there, open a [GitHub issue](../../issues) or [start discussion on GitHub](../../discussions) or [Discord](https://discord.com/invite/bxtD8x6aNF).

All PRs with improvements to docs/code or contributions to existing discussions/issues are welcome.

We want this project to have by far the best DX of any open source project on GitHub. We plan to do live streams of developing the code, various educational videos and a lot more in coming time.

## Docs

All docs can be seen in [docs](docs). Will be rendered nicely on website with [VitePress](https://vitepress.dev/) soon.

It is advisable you read them, before you start developing anything as they provide a lot of context and general knowledge.

There is big focus on documentation and clarity in the project. All code should be clear and understandable and well documented.

Check [docs/dev-tips.md](docs/dev-tips.md) for some advice on development.

## Commands

> **Warning**
> Table below may be out of date. We need to write an automated github action or similar to keep it up to date.

Ran with `bun <Name>`

| Name                | Command                                                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| setup               | bun setup.ts init                                                                                                                                           |
| seed-clone          | git clone https://github.com/learn-anything/seed                                                                                                            |
| seed-update         | cd seed && git pull                                                                                                                                         |
| app                 | cd app && bun tauri:dev                                                                                                                                     |
| web                 | cd website && bun dev                                                                                                                                       |
| web:build           | cd website && solid-start build                                                                                                                             |
| web:start           | cd website && solid-start start                                                                                                                             |
| db                  | cd grafbase/edgedb && tput reset && bun --watch cli/cli.ts                                                                                                  |
| db:init             | cd grafbase/edgedb && edgedb project init                                                                                                                   |
| db:ui               | cd grafbase/edgedb && edgedb ui                                                                                                                             |
| db:watch            | cd grafbase/edgedb && edgedb watch                                                                                                                          |
| db:migrate          | cd grafbase/edgedb && edgedb migration create && edgedb migrate && bunx @edgedb/generate edgeql-js --target ts && bunx @edgedb/generate queries --target ts |
| db:queries-generate | cd grafbase/edgedb && bunx @edgedb/generate edgeql-js --target ts && bunx @edgedb/generate queries --target ts                                              |
| db:get-dsn          | cd grafbase/edgedb && edgedb instance credentials --insecure-dsn                                                                                            |
| db:dump             | cd private && edgedb dump prod.db                                                                                                                           |
| db:load-connections | cd grafbase/edgedb && tput reset && bun cli/loadConnectionsIntoGrafbase.ts                                                                                  |
| api                 | bunx grafbase@latest dev                                                                                                                                    |
| ts                  | tput reset && bun --watch run.ts                                                                                                                            |
| test-rust-wiki      | cd app/src-tauri/crates/wiki/ && cargo watch -q -- sh -c "tput reset && cargo test -q --lib"                                                                |
| grafbase            | npx grafbase@latest dev                                                                                                                                     |
| format              | prettier -w .                                                                                                                                               |
| lint:code           | eslint --ignore-path .gitignore --max-warnings 0 --ext .ts,.tsx,.js,.jsx .                                                                                  |
| lint:types          | tsc --noEmit                                                                                                                                                |
| lint                | bun lint:code && bun lint:types                                                                                                                             |

### ♥️

[![MIT](http://bit.ly/mitbadge)](https://choosealicense.com/licenses/mit/) [![Twitter](<a href='https://twitter.com/learnanything_' target="_blank"><img alt='X' src='https://img.shields.io/badge/learnanything-100000?style=plastic&logo=X&logoColor=white&labelColor=black&color=black'/></a>)](https://twitter.com/learnanything_)
