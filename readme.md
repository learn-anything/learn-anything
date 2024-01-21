<p align="center">
  <a href="https://learn-anything.xyz">
    <img alt="Learn-Anything.xyz" src="./docs/brand/learn-anything-banner.png" width="800" />
  </a>
</p>

# [Learn-Anything.xyz](https://learn-anything.xyz) [![Discord](https://img.shields.io/badge/Discord-100000?style=flat&logo=discord&logoColor=white&labelColor=black&color=black)](https://discord.com/invite/bxtD8x6aNF)

> Organize world's knowledge, explore connections and curate learning paths

The end goal of Learn Anything is to become the best place and tool for keeping track of what you know. What ideas you have. What you want to learn next. What you don't know yet. And how you can learn that in the most optimal way possible given what you know already.

[Try the website yourself first to get a feel for it](https://learn-anything.xyz).

It is a fully open source project with an active community on [Discord](https://discord.com/invite/bxtD8x6aNF). There is great focus on both DX of developing everything LA and even more, the end user UX.

Project consists of a [website](website), [desktop app](app), [mobile app](mobile).

There is also separate repo of [AI](https://github.com/learn-anything/ai) where we train & fine tune LLMs to provide AI interfaces to all things knowledge. Part of the goals of LA is to reach AGI and do it in a fully open way. The current start of that journey is in providing state of art ability to index any knowledge of a person and provide chat bot interface to it with different privacy controls. As well as having state of the art chat bots for each of the topics in LA platform.

If you're interested in the mission and like the project, join [Discord](https://discord.com/invite/bxtD8x6aNF) where you can ask questions and interact with community and read on to get you started writing your first code.

Any issues with setup or making your first feature or trying to fix a bug will be resolved asap. Same goes for discussing ideas on how to make the tool even better than it is now.

Current tasks to do are in [GitHub issues](../../issues) (organised with [labels](https://github.com/learn-anything/learn-anything.xyz/labels)). Tasks currently in focus are seen [here](https://github.com/learn-anything/learn-anything.xyz/labels/Current%20Month).

###### Contents

- [File structure](#file-structure) - make sense of how code is laid out in the repo
- [Setup](#setup) - get started with development
  - [Setup EdgeDB](#setup-edgedb)
    - [Generate edgedb-js bindings](#generate-edgedb-js-bindings)
    - [Seed EdgeDB with content](#seed-edgedb-with-content)
- [Run GraphQL server (Grafbase)](#run-graphql-server-grafbase)
- [Run website (Solid)](#run-website-solid)
- [Run desktop app (Tauri/Rust)](#run-desktop-app-taurirust)
- [Run mobile app (NativeScript/Solid)](#run-mobile-app-nativescriptsolid)
- [Contribute](#contribute) - contribute to project effectively
- [Docs](#docs)
- [Design](#design)
- [Commands](#commands)

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
- [mobile](mobile) - mobile app using NativeScript/Solid
- [shared](shared) - shared TS functions (can be used by any part of monorepo)
- [website](website) - learn-anything.xyz website code in Solid
  - [components](website/components) - solid components
  - [routes](website/src/routes) - routes defined using file system

## Setup

Everything is driven using [bun](https://bun.sh) commands as part of monorepo setup using [pnpm workspaces](https://pnpm.io/workspaces) ([bun gave issues with installing deps and breaking builds](docs/bun.md)) so [pnpm](https://pnpm.io) is used to install and add dependencies but bun to run them. You can also swap `bun` with `pnpm` and commands will work as well. Bun is used only because it's faster to run and works quite well already in most cases.

First run:

```
pnpm i
bun setup
```

`bun setup` runs `bun cmd.ts init` (can see [cmd.ts](cmd.ts) code for what it does). It will create `.env` files for you so you can start coding the project fast. It will also `git clone` [seed](https://github.com/learn-anything/seed), [ai](https://github.com/learn-anything/ai) and [solana](https://learn-anything.xyz/solana) repos.

Monorepo tooling should get better soon. If you're intested in making it better by integrating [Nx](https://nx.dev) or similar tools, please reach out on [Discord](https://discord.com/invite/bxtD8x6aNF).

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

Then run `bun cmd.ts seedEdgeDb`.

Then do:

```
cd grafbase/edgedb
edgedb database wipe -I learn-anything
edgedb restore seed.db
```

Now you can run `bun db:ui`. This will open EdgeDB graphical interface where you can run queries or explore the schema. The EdgeDB database you got, has all the content of existing Learn Anything, you can explore the data inside and run various queries.

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

When you make changes to grafbase.config.ts as we are using [Mobius](https://github.com/SaltyAom/mobius) as our GraphQL client and it is fully typed. You can run `bun mobius-update`, it will update the schema in [shared/lib/mobius.ts](shared/lib/mobius.ts) with new schema.

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

Goal of desktop app is to be essentially a clone of [Obsidian](https://obsidian.md/)/[Reflect](https://reflect.app) (working with local markdown files). And with ability to publish the markdown content to LA. All private data and files will be end to end encrypted and synced with [mobile app](mobile).

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

## Run mobile app (NativeScript/Solid)

Read instructions in [mobile](mobile)

## Contribute

Current tasks to do are in [GitHub issues](../../issues) (organised with [labels](https://github.com/learn-anything/learn-anything.xyz/labels)). Tasks currently in focus are seen [here](https://github.com/learn-anything/learn-anything.xyz/labels/Current%20Month).

If task/bug is not mentioned there, open a [GitHub issue](../../issues) or [start discussion on GitHub](../../discussions) or [Discord](https://discord.com/invite/bxtD8x6aNF).

All PRs with improvements to docs/code or contributions to existing discussions/issues are welcome.

We want this project to have by far the best DX of any open source project on GitHub. We plan to do live streams of developing the code, various educational videos and a lot more in coming time.

## Docs

All docs can be seen in [docs](docs). Will be rendered nicely on website with [VitePress](https://vitepress.dev/) soon.

It is advisable you read them, before you start developing anything as they provide a lot of context and general knowledge.

There is big focus on documentation and clarity in the project. All code should be clear and understandable and well documented.

Check [docs/dev-tips.md](docs/dev-tips.md) for some advice on development.

## Design

All design is done in [Figma](https://www.figma.com/file/cJbTJZLDUpz8QPI5Q9Etiu/LA?type=design&node-id=1%3A28&mode=design&t=jNI0kHbT31qr4rpm-1). There is also a [FigJam going over the software architecture](https://www.figma.com/file/GelB3DWCdjQ2tU4v3kbHOj/LA-architecture?type=whiteboard&node-id=0%3A1&t=nL3VXI1ztTo7ohmd-1) such as the [EdgeDB schema](grafbase/edgedb/dbschema/default.esdl).

If you're designer and want to help out or have ideas, mention it on [Discord](https://discord.com/invite/bxtD8x6aNF).

## Commands

> **Warning**
> Table below may be out of date. We need to write an automated github action or similar to keep it up to date.

Ran with `bun <Name>`

| Name                | Command                                                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| setup               | bun cmd.ts init                                                                                                                                             |
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

### 🖤

Learn Anything logo by [NUMI](https://github.com/numi-hq/open-design):

[<img src="https://raw.githubusercontent.com/numi-hq/open-design/main/assets/numi-lockup.png" alt="NUMI Logo" style="width: 200px;"/>](https://numi.tech/?ref=learn-anything)

[![Discord](https://img.shields.io/badge/Discord-100000?style=flat&logo=discord&logoColor=white&labelColor=black&color=black)](https://discord.com/invite/bxtD8x6aNF) [![X](https://img.shields.io/badge/learnanything-100000?logo=X&color=black)](https://twitter.com/learnanything_)
