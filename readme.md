# Learn Anything

Explanation of vision and future [here](https://wiki.nikiv.dev/ideas/learn-anything).

Ask questions on [Discord](https://discord.com/invite/bxtD8x6aNF) if interested in developing the project or you get issues with setup.

## File structure

- [api](api)
  - [db](api/db)
    - [dbschema](api/db/dbschema)
      - [default.esdl](api/db/dbschema/default.esdl) - [EdgeDB schema](https://www.edgedb.com/docs/intro/schema) definining all the models and relations
      - [migrations](api/db/dbschema/migrations) - migration files get generated after running `pnpm db:migrate`
    - [sync](api/db/sync) - code to sync database with .md files
      - [sync.ts](api/db/sync/sync.ts) - code to talk with EdgeDB with local queries + sync db with file system
      - [wiki.ts](api/db/sync/wiki.ts) - code to sync .md files with DB
    - [client.ts](api/db/client.ts) - exports client to connect with EdgeDB
    - [topic.ts](api/db/topic.ts) / [user.ts](api/db/user.ts) - CRUD functions on models
  - [grafbase](api/grafbase) - [Grafbase](https://grafbase.com/) provides GraphQL API layer for all server functions like talking with DB
    - [resolvers](api/grafbase/resolvers) - [edge resolvers](https://grafbase.com/docs/edge-gateway/resolvers) are server functions exposed with GraphQL
    - [schema.graphql](api/grafbase/schema.graphql) - [Grafbase's config](https://grafbase.com/docs/config)
  - [server](api/server) - temporary [hono](https://hono.dev/) server until grafbase supports public resolvers
- [app](app)
  - [packages](app/packages)
    - [electron-web](app/packages/electron-web) - electron's [renderer web process](https://github.com/cawa-93/vite-electron-builder/tree/main#project-structure)
    - [main](app/packages/main) - electron main process (use node.js to do OS operations)
    - [preload](app/packages/preload) - exported functions from [app/packages/preload/src/index.ts](app/packages/preload/src/index.ts) are available in `electron-web`
    - [website](app/packages/website) - website code
      - [components](app/packages/website/components) - solid components
      - [lib](app/packages/website/lib) - generic utils
      - [routes](app/packages/website/routes) - routes defined using file system

## Setup

This project is a monorepo setup using [pnpm workspaces](https://pnpm.io/workspaces).

```
pnpm i
```

Everything is driven using `pnpm ..` commands.

The current focus is on making [Electron app](#run-electron-app) work. Other steps will give you issues in setup.

Ask for help on [Discord](https://discord.com/invite/bxtD8x6aNF).

## Setup DB

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

## Seed DB with content

`pnpm i seed-clone`

This will `git clone` [seed repo](https://github.com/learn-anything/seed).

The goal is to seed EdgeDB with [this content](https://github.com/learn-anything/seed/tree/main/wiki/nikita). Can be seen online [here](https://wiki.nikiv.dev).

However you can try seed it with a wiki / folder of markdown of yourself.

Just add a folder in `seed/wiki` like `seed/wiki/my-wiki` and put some .md files inside.

## Run Sync DB code

The goal of this command:

```
pnpm db:sync
```

Is to sync your local EdgeDB instance with the contents of the `seed` folder you just cloned.

For this, you need to create a file here:`api/db/sync/.env`. With content like this:

```
SEED_FOLDER_NAME=nikita
USERNAME=nikita
```

You can swap the names to your own. The `SEED_FOLDER_NAME` is the folder that is found in `seed/wiki` (from clone above).

Read [api/db/sync/sync.ts](api/db/sync/sync.ts) and [api/db/sync/wiki.ts](api/db/sync/wiki.ts) for details how sync works.

## Run server

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

## Run Electron app

```
pnpm app:dev
```

This will start an Electron development app. Built using [this app starter](https://github.com/cawa-93/vite-electron-builder).

Solid code that renders the app is located at [app/packages/electron-web](app/packages/electron-web).

## Run TinyBase setup

Currently trying to make [TinyBase](https://tinybase.org/) setup with [SQLite adapter](https://tinybase.org/api/persister-sqlite3/).

```
pnpm app:tinybase
```

Will `tsx` run [app/packages/tinybase/main.ts](app/packages/tinybase/main.ts).

Goal of that file currently is to load all the .md files from the `seed` folder into TinyBase store backed by SQLite.

If changes are made to SQLite content, it will update the files in the file system using TinyBase reactive hooks.

Once that works in just Node, it should be connected to Electron.

TinyBase is the main app state of the app. Front end state is reflection of TinyBase state. If TinyBase state changes, GraphQL requests to mutate real backend state are sent where needed. Same goes for any other side effects that needs to happen such as updating of files.

## Run web

<!-- TODO: automate creating of `.env` file with default content as part of `pnpm setup` command -->
<!-- TODO: do same for API .env too -->

Create `.env` file inside [app/packages/website](app/packages/website) with this content:

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

Currently not all tasks are written in public. The big goals being worked on right now are outlined below.

If you are interested in helping out, please join [Discord](https://discord.com/invite/bxtD8x6aNF) and let's make it happen. ✨

The project is incredibly ambitious once it works.

## Big goals

### Editor support

Electron app should be close to [Obsidian](https://obsidian.md/)/[Reflect](https://reflect.app/).

Be able to edit markdown files, show sidebar of files/folders on the left.

Text editor uses [Solid CodeMirror](https://github.com/riccardoperra/solid-codemirror). Similar to [CodeImage project](https://github.com/riccardoperra/codeimage).

### Local first

[TinyBase](https://tinybase.org/) used in Electron app to persist everything.

## Code inspirations

[Inlang](https://github.com/inlang/inlang), [CodeImage](https://github.com/riccardoperra/codeimage), [Actual](https://github.com/actualbudget/actual).

Tech stack is [very similar to Inlang](https://github.com/inlang/inlang/blob/main/rfcs/tech-stack/RFC.md).

## Future DX wins

- Setup [devenv](https://devenv.sh/) to get one command dev env install. Currently we ask to install EdgeDB manually for example.

### Maybe

Can potentially [use only one codebase for both web code and electron app renderer code](https://github.com/brillout/vite-plugin-ssr/discussions/1011), using [vite-plugin-ssr](https://vite-plugin-ssr.com/).

Electron expects `index.html` file as entry but [Solid Start](https://github.com/solidjs/solid-start) does not provide a `index.html` file. At least I don't know how to make that work so for now its split up. The app is quite different to the website in features so it's even for the best.
