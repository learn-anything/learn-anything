# Grafbase resolvers

Resolvers are grouped:

- all resolvers in [root](resolvers) are authenticated using [Hanko](https://www.hanko.io/) auth token
- resolvers in [public](resolvers/public) don't have any auth setup
- resolvers in [internal](resolvers/internal) are auth'd using a secret key passed
