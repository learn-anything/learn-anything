## Public website release [september 19]

- do call to hanko on token validate to get email from token
- global edit of guide working
  - works well with global stores
  - mutations work
    - adding new sections/links
    - deleting links/sections
    - reorder of links/sections
  - entering URL into URL input, does search if URL exists as GlobalLink
    - if it does, grab all metadata for URL and prefill it
    - otherwise, give option for user to create new GlobalLink with new metadata
  - make it work visually well
  - all links in sections are GlobalLinks and thus can be tracked as working on / completed
  - section can have ordered list of links and unordered
    - order list of links is sorteable, order matters
- upload guides for 1050 topics
  - start with 3d-printing and go down the generated list one by one
- update topic graph in landing page
  - landing page looks and works great
  - graph works well on mobile/desktop, nicely scrollable and zoomeable
- DX: add codegen for all resolvers, so they are typed
  - https://github.com/grafbase/grafbase/pull/599 use this as reference
- test auth works in dev.
- test grafbase works in dev.
- test user can sign in and mark topic as learned and on refresh it keeps the state for user
- check mobile layout works for landing page / pricing / global topic page / user profile
- global topic page works well visually (new design)
- update readme.md and make sure dev env is easy to setup for new devs
- use docs/todo.md for all issues until KusKus adds support for GitHub
  - in future have KusKus sync up GitHub issues with this `docs/todo.md` file
  - each of the `## ` headings here is a GitHub issue. with an option to create one of the bullet points into a separate sub GitHub issue (where sub issue will show the parent issue)
    - this sync is important to have discussions available. still, everything is serialisable into this markdown `docs/todo.md` file, updated on CI
  - grab a list of all `todo: ` comments in code and show it as a generated list in `code-todo.md` too
  - embedding images should work too, inline links to images (probably uploaded to GitHub inline in todo.md) (once KusKus works with GitHub)
- stripe works, updates `memberUntil` status of users when payment is succesful
- design UI for when users hit a /<topic> that is not yet in LA db
  - show empty state, users can still mark progress on the topic and request to be moderator of it to create a guide for it

## Public desktop app release [september 24]

- let users choose a folder of existing markdown files to sync with
- or allow choosing a folder where markdown files will be synced to
- load in all the .md files as topics and show in sidebar
- allow searching of topics
- allow editing of topics using CodeMirror
  - or Monaco editor, CodeMirror is cleanest (what Obsidian uses)
- loads all the desktop app state into SQLite
  - tauri/rust reads and writes from sqlite db. sqlite db is fully reactive
  - so if changes are made to files in the connected folder, sqlite db is updated with changes
  - likewise if changes are made to solid store state, it gets persisted to sqlite and also to the file system where needed
- public content
- move all useful code that existed in previous [Electron version](https://github.com/learn-anything/electron-version)

## Public user wikis [september 30]

- all content published via desktop app, rendered as in [wiki.nikiv.dev](https://wiki.nikiv.dev)

## Mobile app release [october 8]

- use tamagui starter
- make sure hanko auth works well
- allow searching for topics

## Public website improvements

- hit Grafbase cache for most things where it makes sense
  - global guides, more?
- official topics should have verified badge

## GlobalLink improvements

- global links added should have `verified: false/true`
  - LA validates links that are non verified to make sure they have right metadata

## Analytics

- [Pirsch](https://github.com/pirsch-analytics/pirsch) is interesting

## Other

- if not editing guide sections inline, can highlight the section being edited when `section edit` slide window shows
- better web search using https://github.com/oramasearch/orama
- do proper observability and logging, especially on edgedb CRUD queries, make sure it can't fail for bad reasons, and if error happens, surface it to grafbase/users
- log all `console.error` with [TinyBird](https://www.tinybird.co) or [HyperDX](https://github.com/hyperdxio/hyperdx)
