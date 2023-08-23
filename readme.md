# [Learn-Anything.xyz](https://learn-anything.xyz)

> Organize world's knowledge, explore connections and curate learning paths

Explanation of project's high level goals is [here](https://wiki.nikiv.dev/ideas/learn-anything).

Current focus is on making [Tauri app](#run-tauri-app) working. Essentially making an app like [Obsidian](https://obsidian.md/).

Reference [file structure](#file-structure) to make sense of how code is laid out in the repo.

Read [setup](#setup) to get started with development.

Current tasks to do are [here](#tasks).

Ask questions on [Discord](https://discord.com/invite/bxtD8x6aNF) if interested in developing the project or you get issues with setup.

## File structure

Tech stack is described [here](docs/tech-stack.md).

- [api](api) - server related actions
  - [edgedb](api/edgedb) - [EdgeDB](https://www.edgedb.com/) used as main server database
    - [dbschema](api/edgedb/dbschema)
      - [default.esdl](api/edgedb/dbschema/default.esdl) - [EdgeDB schema](https://www.edgedb.com/docs/intro/schema) definining all the models and relations
      - [migrations](api/edgedb/dbschema/migrations) - migration files get generated after running `pnpm db:migrate`
    - [client.ts](api/edgedb/client.ts) - exports client to connect with EdgeDB
    - [topic.ts](api/edgedb/topic.ts) / [user.ts](api/edgedb/user.ts) - CRUD functions on models
  - [grafbase](api/grafbase) - [Grafbase](https://grafbase.com/) provides GraphQL API layer for all server functions like talking with DB
    - [resolvers](api/grafbase/resolvers) - [edge resolvers](https://grafbase.com/docs/edge-gateway/resolvers) are server functions exposed with GraphQL
    - [schema.graphql](api/grafbase/schema.graphql) - [Grafbase's config](https://grafbase.com/docs/config)
  - [server](api/server) - temporary [hono](https://hono.dev/) server until grafbase supports public resolvers
- [app](app) - desktop app in Tauri/Solid
- [lib](lib) - shared utility functions
- [test](test) - test cases (useful for itereating quickly)
- [website](website) - learn-anything.xyz website code in Solid
  - [components](website/components) - solid components
  - [routes](app/packages/website/routes) - routes defined using file system

## Setup

Everything is driven using [pnpm](https://pnpm.io/installation) commands as part of monorepo setup using [pnpm workspaces](https://pnpm.io/workspaces).

First run:

```
pnpm i
pnpm dev-setup
```

`pnpm dev-setup` will `git clone` [seed repo](https://github.com/learn-anything/seed). It's needed for dev setup + [test suite](#test) to work.

## Run Tauri app

> TODO: WIP

Moving code from [Electron version](https://github.com/learn-anything/electron-version).

Check [tasks](#tasks).

### Useful DevTools panel

> broken until tauri app is fixed

In the app you get after running `pnpm app:dev`, you will see DevTools panel in bottom right corner. It contains a list of useful actions you can run to aid you.

One of the actions is `Seed TinyBase`. This will seed your local TinyBase store/sqlite with [one of the wikis](https://github.com/learn-anything/seed/tree/main/wiki/nikita) in seed folder.

Read [app/packages/preload/src/index.ts](app/packages/preload/src/index.ts) file for details. `syncWikiFromSeed` is the function.

## Test

> below tests are in TS, only relevant now to help migration to rust

```
pnpm test
```

Will run tests found in [test](test).

[test/wiki.test.ts](test/wiki.test.ts) file tests markdown file parsing.

Running code via tests is very effective. You can open terminal on your right and edit code on the left and on each `.ts` file save it will rerun the test and check if behavior you are testing is correct. Reading through the test suite is great way to understand the backend part of the app.

<!-- You can point the tests at your own wiki/notes folder too. Put the folder with files into seed/test folder you get from running `pnpm dev-setup` -->

## Setup EdgeDB

> broken until tauri app is fixed

Assumes you installed [EdgeDB](https://www.edgedb.com/) (run `curl ..` command).

```
pnpm db:init
```

Follow instructions, name EdgeDB instance `learn-anything`.

Run `edgedb ui`. This will open EdgeDB graphical interface where you can run queries or explore the schema.

Run below command to apply the schema defined in [default.esdl](db/dbschema/default.esdl) on your local DB:

```
pnpm db:watch
```

Then, generate [EdgeDB TS](https://github.com/edgedb/edgedb-js) bindings with:

```
pnpm db:ts-generate
```

<!-- ## Seed DB with content -->

<!-- The goal is to seed EdgeDB with [this content](https://github.com/learn-anything/seed/tree/main/wiki/nikita). Can be seen online [here](https://wiki.nikiv.dev).

However you can try seed it with a wiki / folder of markdown of yourself.

Just add a folder in `seed/wiki` like `seed/wiki/my-wiki` and put some .md files inside. -->

<!-- ## Run Sync DB code

The goal of this command:

```
pnpm db:sync
```

Is to sync your local EdgeDB instance with the contents of the `seed` folder you just cloned.

For this, you need to create a file here:`api/edgedb/sync/.env`. With content like this:

```
SEED_FOLDER_NAME=nikita
USERNAME=nikita
```

You can swap the names to your own. The `SEED_FOLDER_NAME` is the folder that is found in `seed/wiki`.

Read [api/edgedb/sync/sync.ts](api/edgedb/sync/sync.ts) and [api/edgedb/sync/wiki.ts](api/edgedb/sync/wiki.ts) for details how sync works. -->

## Run server

> broken until tauri app is fixed

Before running server, create file at `api/server/.env` with this content:

```
EDGEDB_INSTANCE=learn-anything
EDGEDB_SECRET_KEY=edbt_ey
```

`EDGEDB_SECRET_KEY` can be gotten by running `pnpm db:ui` which will open the EdgeDB UI.

In terminal after running above command you will see url like `http://localhost:10700/ui?authToken=edbt_ey`. `EDGEDB_SECRET_KEY` is the authToken content.

Then run:

```
pnpm api
```

In future [Grafbase](https://grafbase.com/) will be used for all API requests. There is blocker there that you can't do both public and private resolvers.

```
pnpm api:grafbase
```

Will start Grafbase locally and give you GraphQL access.

## Run web

> broken until tauri app is fixed

<!-- TODO: automate creating of `.env` file with default content as part of `pnpm setup` command -->
<!-- TODO: do same for API .env too -->

Create `.env` file inside [website](app/packages/website) with this content:

```
VITE_HANKO_API=https://e879ccc9-285e-49d3-b37e-b569f0db4035.hanko.io
API_OF_GRAFBASE=http://127.0.0.1:4000/graphql
```

[Hanko](https://www.hanko.io/) is used as auth provider. You can swap Hanko API variable content with one from a project you create yourself.

Run:

```
pnpm web:dev
```

Open http://localhost:3000

## Contribute

The tasks to do are [outlined below](#tasks) (sorted by priority).

If you are interested in helping out, join [Discord](https://discord.com/invite/bxtD8x6aNF) and let's make it happen. ✨

## Tasks

All issues are made in [this repo](https://github.com/nikitavoloboev/la-issues/issues) for now. Until [this](https://github.com/calcom/synclinear.com/issues/127) is solved.

Most urgent tasks to do are:

- [Move markdown parser from ts to rust](https://github.com/nikitavoloboev/la-issues/issues/2)
- [Setup Tauri + SQLite + Wiki sync](https://github.com/nikitavoloboev/la-issues/issues/21)
- [Publish all content correctly to EdgeDB](https://github.com/nikitavoloboev/la-issues/issues/31)
- [Website release](https://github.com/nikitavoloboev/la-issues/issues/11)
- [Desktop app release](https://github.com/nikitavoloboev/la-issues/issues/17)

## Docs

All docs can be seen in [docs](docs).

Will be uploaded to the web and rendered nicely soon.

### ♥️

[![MIT](http://bit.ly/mitbadge)](https://choosealicense.com/licenses/mit/) [![Twitter](http://bit.ly/latwitt)](https://twitter.com/learnanything_)
