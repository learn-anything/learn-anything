# CLI

Purpose of CLI is to quickly iterate on EdgeDB contents. Easily call [edgedb-js](https://github.com/edgedb/edgedb-js) query builder functions from [crud](../crud) folder and run them on local/production database.

## Setup

Create `.env` file in [edgedb](../) folder with this content:

```
name=your-name
email=your-email@gmail.com
```

Then from root, run `bun db:cli` and make changes to [cli.ts](cli.ts) file.

## Sync wiki folder

Add to `.env`

```
wikiFolderPath=path/to/wiki/
```

Where `wikiFolderPath` can link to the `seed` folder. If you ran `bun dev-setup` in root of project, you have [seed](https://github.com/learn-anything/seed) folder available. The path can then be something like:

```
wikiFolderPath=/Users/nikiv/src/learn-anything.xyz/seed/wiki/nikita
```
