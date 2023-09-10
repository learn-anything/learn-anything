# CLI

Current purpose of CLI is to seed EdgeDB database from content of a folder with markdown files.

[This folder](https://github.com/learn-anything/seed/tree/main/wiki/nikita).

## Setup

Create `.env` file in this folder with content:

```
name=your-name
email=your-email@gmail.com
wikiFolderPath=path/to/wiki/
```

Example `wikiFolderPath` can link to the `seed` folder. If you ran `pnpm dev-setup` in root of project, you have [seed](https://github.com/learn-anything/seed) folder available. The path can then be something like:

```
wikiFolderPath=/Users/nikiv/src/learn-anything.xyz/seed/wiki/nikita
```

## Run

Can run from root using:

```
pnpm run db:cli
```

Which using [watchexec](https://watchexec.github.io) will rerun the file on any of the `.ts` file changes.

```
watchexec --no-vcs-ignore --restart --exts ts "tput reset && tsx edgedb/cli/cli.ts" --project-origin
```

Can also run with:

```
tsx cli.ts
```

## Tasks

- move all the .md files into topics with everything correctly stored in EdgeDB as per the schema
- move ts code from electron version into this CLI
  - pre seed Nikita's wiki so LA can release
- make a more generic CLI to allow all kinds of operations on top of Learn Anything (local and server)
- adapt this CLI to be used as a way to bootstrap EdgeDB for local development for all kinds of cases
- move markdown parsing code to Rust and into `app/src-tauri/crates/wiki/src/lib.rs`
  - as that rust code is then used in desktop app
- also store everything in sqlite, CLI will seed both EdgeDB and SQLite fully from a provided folder of markdown files
