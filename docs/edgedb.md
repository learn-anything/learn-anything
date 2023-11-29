## Remember

- try to always do everything in one edgedb trip
  - one `.client()` call, no more
  - it's ok to have multiple when prototyping but for prod, keep it to one `.client()` call

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

Select all properties of an object:

```
select GlobalNote {
  *
}
```

Select all properties of an object (including nested things):

```
select GlobalNote {
  **
}
```

## Reference code

```
// check that user is admin. there is probably better way to do this, ideally as part of one .client() call
// also probably no need for this function, just secure the call to function via internal resolver instead
// this code is just for reference in case there is need for it
const adminUser = await e
  .select(e.User, (user) => ({
    filter: e.all(
      e.set(e.op(user.hankoId, "=", hankoId), e.op(user.admin, "=", true))
    )
  }))
  .run(client)
if (adminUser.length === 0) {
  return
}
```

## Notes

When we had free action blocks, we could do this in grafbase resolvers in the `catch` area.

```
if (err instanceof ConstraintViolationError) {
  throw new GraphQLError("out-of-free-actions")
} else {
  console.error(err)
  throw new GraphQLError(JSON.stringify(err))
}
```

- [optional properties need ?? for handling the case when they're missing. For equality comparisons you could just use ?=, but when things are greater or less than a missing value needs more explicit handling](https://discord.com/channels/841451783728529451/1177262394175660104/1178762322110595184)
