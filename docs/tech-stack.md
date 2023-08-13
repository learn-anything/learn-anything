# Tech stack

## Desktop app (macOS/Windows/Linux)

### Built with

- Desktop app is built with [Tauri](https://tauri.app/) and [Rust](https://www.rust-lang.org).
  - See [Tauri architecture](https://tauri.app/v1/references/architecture/) for how Tauri works.
- All useful global state is persisted to [SQLite](https://www.sqlite.org/index.html).
- WebView is built with [Solid](https://www.solidjs.com/).

### On startup

- Loads data from SQLite and passes it to WebView.
  - Uses [rusqlite](https://github.com/rusqlite/rusqlite) crate for all SQLite queries.
  - Data sent from Tauri into WebView, gets stored in Solid stores and can be used globally in all components of the app.
- If user is authenticated and has an account, a GraphQL query will be sent to server to get all the latest changes.
  - The changes coming from the server will update the state of SQLite and thus update the UI too.

### Running app

- User actions made in app (WebView) sends messages to Tauri which writes everything to SQLite. Or reads things from SQLite wherever needed.
- Tauri/Rust connects to a local folder in user OS file system. All topics are persisted as markdown files in the folder.
  - [markdown-rs](https://github.com/wooorm/markdown-rs) crate is used to convert from `.md` file content to [Topic](topic.md) and vice versa.
  - File watcher is present that listens to any changes made to the folder. If any of the files get modified or deleted, it will update SQLite accordingly too. If file was deleted, it will do `soft delete` of the `Topic` in SQLite. Users can thus revert .md file deletes.
- If user is authenticated and has an account, the app will optionally sync or publish to the server
  - How it happens is if sync is setup, if any change is made to SQLite, it will send GraphQL requests with the changes to the server too.
  - See [this talk](https://www.youtube.com/watch?v=35Q8B3uq9Us&t=1015s). The setup described in the talk goes over [TinyBase](https://tinybase.org/) tool, but our setup is essentially same, just in Rust.

### Local language model inference

- Rust/tauri binary will either embed a 7B or 13B LLaMA model with the binary. Users will be provided the choice to download app with the language model embedded or not.
  - [LLaMA.rs](https://news.ycombinator.com/item?id=35171527) is used to embed the language model into the binary and provide inference
- Potentially the language model is provided separately as a download. And then inference is served via HTTP server
  - This can allow sharing LLaMA model inference with other apps too. [TextSynth Server](https://bellard.org/ts_server/) can potentially be used.

### Local language model fine tuning

- The model is continuously fine tuned on user data
  - TODO:

## Website (learn-anything.xyz)

### Built with

- Front end is built with [Solid](https://www.solidjs.com/)
- All useful global state is persisted to local storage with [TinyBase](https://tinybase.org/)
- [Hanko](https://www.hanko.io/) is used for user authentication
  - on succesful auth, a cookie get saved and is then used to do authorised GraphQL queries
- [GraphQL Mobius](https://github.com/SaltyAom/mobius) used to do typed GraphQL queries
  - All data received back is then saved to Solid stores which then updates the UI

### On startup

- Depends on page but mostly it will:
  - load data from local storage via TinyBase into Solid stores, UI updates instantly
  - send GraphQL request to load fresh and missing data
    - load it into solid stores and update UI

### Running website

- Users do actions in the website, update local solid stores
  - on each solid store update, GraphQL request gets sent to persist the changes to the server
  - there are [Server-Sent Events](https://grafbase.com/blog/building-realtime-apps-with-server-sent-events-and-graphql) setup to live update the stores with data from the server (if there is any)

### Server Database

- [EdgeDB](https://www.edgedb.com/) is used to store all data

### Server API layer

- [Grafbase](https://grafbase.com/) is used to provide a GraphQL access layer to all the API.
  - Grafbase is hosted with [Cloudflare Workers](https://workers.cloudflare.com/) and has low latency on each API call
  - Grafbase allows you to write TS and Rust via WASM to run code at the edge
- Grafbase API is setup to do all CRUD operations on top of EdgeDB (creating, reading, updating, deleting data)
- Grafbase is also setup to run any logic that needs to be ran on server too, such as creating Stripe checkout sessions, processing payments etc.

#### In Go

- A lot of server code will be written in Go exposed as GraphQL too.
  - Stiched together with Grafbase to provide one GraphQL interface to everything
- Go code is deployed as Docker container to ([Google Cloud](https://cloud.google.com)) with [proper logging, observability setup](https://twitter.com/nicoritschel/status/1690505240582422528?s=20)

### Scraper

- Google like scraper is built in Go using [Colly](https://github.com/gocolly/colly)
  - it watches over many websites and ingests the data into the system
  - the data then gets processed and added to the database
