# Contributing ♥️

Thank you for wanting to contribute!

Any type of contribution is welcome, not just code. You can help with:

- **Bugs / Features:** Share bug reports or make feature requests. Check [open issues](../../issues) first in case it was already brought up.
- **Community:** Contribute to open discussions. Join our [Discord community](https://discord.gg/KKYdWjt).
- **Code:** Run this project locally by reading instructions below. Take a look at [open issues](../../issues) and see if anything sparks your interest.
- **Docs:** Docs are the best contribution anyone can make to any project.

## Dependencies

Learn Anything currently uses:

- [NextJS](https://nextjs.org) with [BlitzJS](https://blitzjs.com) to render the website.
  - BlitzJS gives nice features like setting up [Prisma](https://www.prisma.io/) which lets us query our database from both backend and front end.
- [Postgres](https://www.postgresql.org) to store all data.
- [Go](https://golang.org). Currently use Go to write the CLI tool to communicate with LA. CLI is inspired by [gh](https://github.com/cli/cli).

## Start project

The repo consists of these main folders.

- [api/cmd](api/cmd) holds the CLI tool.
- [docs](docs) holds documentation. Other docs related to LA (not directly code related) can be found [here](https://www.notion.so/learnany/Public-b3b8e046a6bc44549367b84423360b93).
- [web](web) holds all the website code. Both all the NextJS pages, Prisma queries.

[HyperLink Academy](https://gitlab.com/jaredpereira/hyperlink-academy) and [lorawan-stack](https://github.com/TheThingsNetwork/lorawan-stack) are great code inspirations.

To run the website:

1. Clone project: `git clone https://github.com/learn-anything/learn-anything`
2. Have Postgres running locally. Can [install Postgres](https://www.postgresql.org) and run a local server. If you are on mac, [Postico](https://eggerapps.at/postico2/) is a nice GUI client for Postgres.
3. Add `.env.local` file in [web](web) directory. With content:

```
DATABASE_URL=postgresql://nikitavoloboev@localhost:5432/learn-anything
```

In future we will have a Dockerfile for both running the database/backend on server and locally.

4. Once Postgres is running locally, can run `yarn` and `yarn start`. And go to http://localhost:3000 ✨

### CLI

Not yet done but it will be a Go CLI tool based off [gh](https://github.com/cli/cli). The goal is to be able to save, retrieve links/ideas from CLI.

## iOS/Android apps

There will be native apps built. iOS app will use [SwiftUI](https://developer.apple.com/xcode/swiftui/) & [Composable Architecture](https://github.com/pointfreeco/swift-composable-architecture).

## Docs

All docs can be improved. Feel free to edit [docs/notes.md](docs/notes.md) file as it's used as a general note file. Feel free to free form discuss code, data model, anything.
