# Grafbase resolvers

Resolvers in `public` folder don't require hanko auth token to be passed.

## Rules

- make all resolvers name end with `Resolver` (prevents clashes with edgedb crud functions that do similar thing to resolver and thus named similarly)

## TODO

- resolvers are untyped
  - there is example [here](https://github.com/grafbase/grafbase/pull/599) for how to type them
  - but it looks like it needs code gen or something, make use of it
