## Connecting to live edgedb instance with fish shell

[Setup env vars](https://www.edgedb.com/docs/guides/cloud#deploying-your-application).

- `set -x EDGEDB_INSTANCE ..`
- `set -x EDGEDB_SECRET_KEY ..`
- `set -x EDGEDB_DATABASE ..`

## Restore local EdgeDB from a dump

Assumes you have a file that is result of running [edgedb dump](https://www.edgedb.com/docs/cli/edgedb_dump).

```
edgedb project init # name it `edgedb`
edgedb database wipe -I edgedb
```

Then run:

```
edgedb restore edgedb-dump.db
```

## Reset database

```
set -x EDGEDB_INSTANCE nikitavoloboev/learn-anything
edgedb

create database tmp;
\c tmp
drop database edgedb;
create database edgedb;
\c edgedb
drop database tmp;
```

## Create dump of database

```
edgedb dump prod.db
```

## Restoring database from `dump`

```
set -x EDGEDB_DATABASE new_database
edgedb restore la.db
```

Where `la.db` is the file you get after running [edgedb dump](https://www.edgedb.com/docs/cli/edgedb_dump). Basically you can't restore into existing db.

## Tips

```
set -x RUST_LOG=debug
```

Setting above flag will give better error messages on CLI outputs.
