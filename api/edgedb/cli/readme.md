# CLI

Current purpose of CLI is to seed EdgeDB database from content of a folder with markdown files.

[This folder](https://github.com/learn-anything/seed/tree/main/wiki/nikita).

## Run

```
tsx cli.ts
```

## Tasks

- move ts code from electron version into this CLI
  - pre seed Nikita's wiki so LA can release
- make a more generic CLI to allow all kinds of operations on top of Learn Anything (local and server)
- adapt this CLI to be used as a way to bootstrap EdgeDB for local development for all kinds of cases
- move markdown parsing code to Rust and into `app/src-tauri/crates/wiki/src/lib.rs`
  - as that rust code is then used in desktop app
- also store everything in sqlite, CLI will seed both EdgeDB and SQLite fully from a provided folder of markdown files
