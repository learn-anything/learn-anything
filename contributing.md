# Contributing

Thank you for wanting to contribute!

Any type of contribution is welcome, not just code. You can help with:

- **Bugs / Features:** Share bug reports or make feature requests. Check [existing issues](../../issues) to avoid duplicates.
- **Community:** Contribute to open discussions. Join our [Discord community](https://discord.gg/bxtD8x6aNF).
- **Code:** Run this project locally by reading instructions below. Take a look at open issues and see if something sparks your interest.
- **Docs:** Docs are the best contribution anyone can make to any project. Update docs if something is unclear or is missing.

<!-- ## Folder structure -->

<!-- - [web](web) holds all the website code. [NextJS](https://nextjs.org) pages, [Prisma](https://www.prisma.io) queries. Using [BlitzJS](https://blitzjs.com) framework.
- [docs](docs) holds documentation. Other docs related to LA can be found [here](https://www.notion.so/learnany/Public-b3b8e046a6bc44549367b84423360b93).
- [api/cmd](api/cmd) holds CLI tool written in [Go](https://golang.org).

[Postgres](https://www.postgresql.org) database is used to store all data.

[HyperLink Academy](https://gitlab.com/jaredpereira/hyperlink-academy) (uses NextJS/Prisma) and [lorawan-stack](https://github.com/TheThingsNetwork/lorawan-stack) (nice contribution guidelines/process, code) are great code inspirations. -->

<!-- ## Run

### Run web

1. Clone project: `git clone https://github.com/learn-anything/learn-anything`
2. Have Postgres running locally. Can [install Postgres](https://www.postgresql.org) and run a local server. If you are on mac, [Postico](https://eggerapps.at/postico2/) is a nice GUI client for Postgres. For setting up a postgresql locally, prisma has a [nice guide](https://www.prisma.io/docs/guides/database-workflows/setting-up-a-database/postgresql)
3. Add `.env.local` file in [web](web) directory. With content:

```
DATABASE_URL=postgresql://nikitavoloboev@localhost:5432/learn-anything
```

In future we will have a Dockerfile for both running the database/backend on server and locally.

4. Once Postgres is running locally, can run `yarn` and `yarn start`. And go to http://localhost:3000 ✨

Check [web](web) for more details.

### Run CLI

Once API is done. CLI will be built. Should be able to save, retrieve links/ideas from CLI.

CLI is inspired by [gh](https://github.com/cli/cli) in design.

### Run iOS/Android apps

Once API is done. There will be native apps built.

iOS app will use [SwiftUI](https://developer.apple.com/xcode/swiftui/) & [Composable Architecture](https://github.com/pointfreeco/swift-composable-architecture).

## Possible issues

If you run into issues that aren't yet fixed or documented but you have a solution for, please submit a PR! Otherwise open an issue. ♥️

#### @prisma/client did not initialize yet error when running `yarn start`

Workaround

1. Run `yarn blitz db migrate`
2. Then run `yarn start`

[Active issue](https://github.com/blitz-js/blitz/issues/1004) on blitz.js -->
