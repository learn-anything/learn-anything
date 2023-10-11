## Public website release

- guide edit
  - show toast when succesfully updated the guide
  - show loading indicator on `submit changes` button as grafbase mutation is processing
  - grafbase mutate global topic
    - edgedb mutation
    - validate inputs on the web page in /edit
    - all should live update
    - check in production, it works
  - and have a way to add a new global link too by pressing `Add link` button
    - will go to `/links/new` page
      - add ability to go to `/links/new` with url as param, to instantly prefill everything
      - also allow attaching a link to a topic instantly too
  - index all global links and put in orama db for search
  - add input box to search over the titles
  - allow adding description to section
  - add a search box for `title` that searches over all the links attached to the current topic
    - on choosing a link, add a link to a section
  - allow rearranging links inside a section
  - do it topic by topic
    - parse topic links, make each global link have main topic as the topic in wiki
      - try do a link to global topic (if fails do as string), then fix it later as real link
  - have separate search for global links that have the topic as main topic
  - and have another search that searches through all global links
  - when pressing `return` on one of the global links in search, show all the link details
  - allow rearranging of links, use https://solid-dnd.com
    - also allow rearranging of sections
  - make Search work with orama, no fuse.js
  - lock guide edit to admins of topic only
- change `getGlobalTopic` query, probably remove it and replace it with just a call to get all user info details about what topics user is learning etc. same for links etc.
  - as separate query
- clean up data model, don't think there is need for `relatedLinks` and `relatedNotes`
  - global link and global note will have a reference to the topic already so can get this info this way
- return all the global links as part of query for global topic
  - use the links returned in search for the guide edit
- fix ui glitch on hovering over search results in landing page
  - part of Search component issue
- modular forms + valibot
- clear `undefinedundefined` from url in global links
- use `create`, not `add` in edgedb function names
- use [modular forms](https://twitter.com/FabianHiller/status/1709753163077591512) for all the forms
  - validate the FormData
- use edgeql queries raw for queries that I can't do with edgedb-js
  - figure out how to use them in nice way
- on success of global link edit
  - make sure only admins can do edits of global links
  - allow main switching topic connected
- separate page to edit links
- in guide edit, search for exsting links by title, add them
  - on edit, go to separate page to do an edit
  - allow reordering of links
  - make endpoints work for all!GG
- check for global links, some start with https: still
  - i.e. `"https://www.mikeash.com/pyblog/friday-qa-2015-07-31-tagged-pointer-strings.html"`
  - do select query and check
  - make `protocol` required
- put all global links into links.json with all properties shown with id for fast search
- go through each wiki page
  - create global topic
  - scan all the links inside the file
    - create global links from all files (make sure `description`, related links are there)
  - calculate graph connections (folder/file or mentions of other topics)
- `/links/<id>` or `/links/<url>` to make edits to global link data
- edit guide
  - add/delete section
    - section guided/unguided
  - add link to section
  - section
- links/new = add new global links
- test stripe works
  - unicode convert to edgedb
    - check the object https://stripe.com/docs/api/subscriptions/object
  - updates `memberUntil` correctly
  - test things locally and in [dashboard](https://dashboard.stripe.com/dashboard)
- make graph work
- load all urls from wiki, not just from ## Links
- make sure on /auth, account gets created
- remove `/` from end of `url` in `GlobalLink`
- integrate search deeply (https://docs.oramasearch.com)
- design close to Fey.app & Luma (clean UI)
  - use https://www.rapidpages.io + solid libs available
    - Zag and Kobalte seem great. Kobalte seems top
- load all global links into local storage with [tinybase](https://github.com/tinyplex/tinybase)
  - use [orama](https://github.com/oramasearch/orama) to search over `.title` of it
    - https://oramasearch.com/blog/optimizing-orama-schema-optimization useful
    - read docs: https://github.com/oramasearch/orama | https://docs.oramasearch.com
- allow searching all global links in landing page
  - have a way to switch between looking for topics and looking for a link to open
  - non member feature, for non members, load in 1,000 top links, then on using result go to /pricing
- update UI of topic page for editing
  - https://lunarui.dev/components
  - https://www.ormanclark.com/
  - https://github.com/raidendotai/openv0
  - https://github.com/emilkowalski/vaul
  - https://github.com/emilkowalski/sonner
    https://github.com/radix-vue/radix-vue
  - https://github.com/huntabyte/formsnap intersting for forms (adapt to solid?)
  - has great ui code: https://github.com/huntabyte
  - https://github.com/huntabyte/shadcn-svelte https://www.shadcn-svelte.com
  - https://reshaped.so
  - https://github.com/hope-ui/hope-ui
- update UI of topic page for viewing
- make sure hanko auth web component does not freeze on auth in Ubuntu
  - hanko team is aware of it, ask what is the progress on it
- update readme.md what happens when `bun web` causes error with crypto not working properly
  - try make it so error does not happen with bun!
- use R2 (https://developers.cloudflare.com/r2/) to store user profile images
  - use fetch api directly https://developers.cloudflare.com/r2/api/workers/
- stripe works, updates `memberUntil` status of users when payment is succesful
  - check https://www.edgedb.com/docs/stdlib/datetime#type::std::datetime | should cover unix time stamp to datetime
  - test it works locally, memberUntil is updated properly
    - https://stripe.com/docs/api/subscriptions/object how to convert from unix number to edgedb datetime
    - https://dashboard.stripe.com/test/apikeys keys
    - https://stripe.com/docs/webhooks#test-webhook
  - deploy hono server
  - test it works in prod
- blur 50 % of guide for non members
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
- design UI for when users hit a /<topic> that is not yet in LA db
  - show empty state, users can still mark progress on the topic and request to be moderator of it to create a guide for it
- `/links/<url>` to show full url + all the metadata
  - allow members to make suggestive edits to the link with new metadata
- update readme to make it work with local edgedb
  - pre seed it with content so dev ux is amazing

## Public desktop app release

- use https://github.com/alxnddr/solid-monaco for editor
  - move all other text editor code to solid-ui repo
  - keep clean code, work with monaco as much as possible
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
- global hotkey to add current link from safari/chrome using applescript (or some other way)
- search existing bookmarks with raycast

## Public user wikis

- all content published via desktop app, rendered as in [wiki.nikiv.dev](https://wiki.nikiv.dev)

## Mobile app release

- https://github.com/bndkt/sharemystack is great
- use [ignite](https://github.com/infinitered/ignite) starter
  - ignite [seems best](https://www.youtube.com/watch?v=KOSvDlFyg20)
  - join their slack community too
- make sure hanko auth works well
- allow searching for topics
- take inspiration from [tamagui starters](https://github.com/tamagui/tamagui/tree/master/starters)
- styling options
  - https://github.com/jpudysz/react-native-unistyles
  - https://x.com/mark__lawlor/status/1710063049271279917
- consider using
  - https://github.com/peterpme/react-native-fast-text

## Public website improvements

- hit Grafbase cache for most things where it makes sense
  - global guides, more?
- official topics should have verified badge

## GlobalLink improvements

- global links added should have `verified: false/true`
  - LA validates links that are non verified to make sure they have right metadata

## Analytics

- [Pirsch](https://github.com/pirsch-analytics/pirsch) is interesting

## Uses

- ability for users to share their stack of tools they use

## API access

- add API access to read/write to LA, guarded with [Unkey](https://github.com/unkeyed/unkey) potentially

## DX

- annoying how when you do mobius query and then try to access stuff with `.data.publicGetGlobalTopic` for example, it's super unsafe
  - find a nice way to solve this

## Other

- if not editing guide sections inline, can highlight the section being edited when `section edit` slide window shows
- better web search using https://github.com/oramasearch/orama
- do proper observability and logging, especially on edgedb CRUD queries, make sure it can't fail for bad reasons, and if error happens, surface it to grafbase/users
- log all `console.error` with [TinyBird](https://www.tinybird.co) or [HyperDX](https://github.com/hyperdxio/hyperdx)
- add multiplayer support using [tinybase/partykit](https://twitter.com/threepointone/status/1704879501232980298)
  - [many great tweets on it](https://twitter.com/jamespearce)
- allow importing of other people's bookmark presets (minus `private` bookmarks)
- get https://github.com/thetarnav/solid-devtools working, specifically ability to select an element in browser and go to the component in code
- release all Figma to public
  - FigJam + Figma main design files
- `import { Motion } from "@motionone/solid"` always gives type trouble, don't get why
- replace fuse.js with orama in Search component. don't use fuse.js any more
