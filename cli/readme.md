# CLI

Purpose of [cli.ts](cli.ts) at this moment is to validate `bun setup` worked.

`bun setup` also creates `run.ts` file in `cli/`. In root you can run `bun cli` to quickly iterate on LA contents like calling into EdgeDB (calling [edgedb-js](https://github.com/edgedb/edgedb-js) query builder functions from [crud](../api/edgedb/crud) folder and run them on local/production database). `run.ts` is git ignored so your changes stay private, if they are useful, turn them into functions and PR.

## Setup

There should be `.env` file in this folder setup as part of `bun setup` with this content:

```
name=your-name
email=your-email@gmail.com
```

## Run

```
bun db
```
