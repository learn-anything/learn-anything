/**
 * @module preload
 */

export { sha256sum } from "./nodeCrypto"
export { versions } from "./versions"
import { getDb } from "./tinybase/tinybase"
import { markdownFilePaths, saveFileToTinybase } from "./tinybase/wiki"
import * as path from "path"

// Everything exported from this file will be available in renderer as global function
// All NodeJS APIs are available in the preload process.

export async function syncWiki(wikiPath: string) {
  const db = await getDb()

  const filePaths = await markdownFilePaths(wikiPath)
  filePaths.map((filePath) => {
    saveFileToTinybase(wikiPath, filePath, db)
  })
}

export async function syncWikiFromSeed() {
  const db = await getDb()

  // hacky but this lets new developers get started without manually entering path
  // fileDirectoryPath will be be a path like: /Users/nikiv/src/app/learn-anything/app/packages/preload/dist
  let fileDirectoryPath = __dirname

  // assumes `pnpm dev-setup` has been run so there is `seed` folder present at root
  const repoDir = fileDirectoryPath.replace("/app/packages/preload/dist", "")
  const wikiPath = path.join(repoDir, "seed/wiki/nikita")

  const filePaths = await markdownFilePaths(wikiPath)
  filePaths.map((filePath) => {
    saveFileToTinybase(wikiPath, filePath, db)
  })

  return db
}

export async function getTopicsSidebar() {
  const db = await syncWikiFromSeed()

  const store = db.getStore()
  console.log(store.getTables(), "tables")

  // const db = await getDb()
  // const store = db.getStore()
  // console.log(store.getTables(), "tables")
  // return store.getTable("topics")
}

export async function getTopic(topic: string) {
  // const db = await getDb()
  // const store = db.getStore()
  // console.log(db)
  // TODO: use tinybase data
  return {
    fileContent: `
    # [SQLite](https://www.sqlite.org/index.html)

    SQLite is great.
    `,
    topicName: "sqlite",
  }
}

export async function getSettings() {
  // TODO: use tinybase
  return {
    wikiPath: "/Users/nikiv/src/app/learn-anything/seed/wiki/nikita",
  }
}
