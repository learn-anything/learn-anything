# Contributing

The project uses:

- [NextJS](https://nextjs.org)/[BlitzJS](https://blitzjs.com) to render the website
- [Postgres](https://www.postgresql.org)/[Prisma](https://www.prisma.io/) to store and access data
- [Go](https://golang.org) for CLI

## Mobile app (separate repo will be made)

- SwiftUI & [Composable Architecture](https://github.com/pointfreeco/swift-composable-architecture) for iOS app

## Start project

1. clone project
2. Add `.env.local` file in `web`. With content:

```
# This env file should NOT be checked into source control
# This is the place for values that changed for every developer

# SQLite is ready to go out of the box, but you can switch to Postgres easily
# by swapping the DATABASE_URL.
# DATABASE_URL="file:./db.sqlite"
DATABASE_URL=postgresql://nikitavoloboev@localhost:5432/learn-anything
```
