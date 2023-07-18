/**
 * @module preload
 */

export { sha256sum } from "./nodeCrypto"
export { versions } from "./versions"
import { getDb } from "./tinybase/tinybase"
import { markdownFilePaths, saveFileToTinybase } from "./tinybase/wiki"

// Everything exported from this file will be available in renderer as global function
// All NodeJS APIs are available in the preload process.

export async function getTopicsSidebar() {
  const db = await getDb()
  const store = db.getStore()
  console.log(store.getTables(), "tables")
  return store.getTable("topics")
}

export async function getTopic(topic: string) {
  const db = await getDb()
  const store = db.getStore()
  console.log(db)
  // TODO: use tinybase data
  return {
    fileContent: `
    # [SQLite](https://www.sqlite.org/index.html)

    SQLite is great.
    `,
    topicName: "sqlite",
  }
}

export async function syncWiki(wikiPath: string) {
  const db = await getDb()
  const filePaths = await markdownFilePaths(wikiPath)
  filePaths.map((filePath) => {
    saveFileToTinybase(wikiPath, filePath, db)
  })
  console.log(filePaths)
}
