# Grafbase resolvers

Resolvers are grouped:

- all resolvers in [root](resolvers) are authenticated using [Hanko](https://www.hanko.io/) auth token
- resolvers in [public](resolvers/public) don't have any auth setup
- resolvers in [internal](resolvers/internal) auth using a secret key passed

## Rules

- make all resolvers name end with `Resolver` (this avoids eslint complaining about unused `const`)
