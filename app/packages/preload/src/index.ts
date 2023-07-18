/**
 * @module preload
 */

export { sha256sum } from "./nodeCrypto"
export { versions } from "./versions"
import { getDb } from "./tinybase/tinybase"
import { markdownFilePaths } from "./tinybase/wiki"

// Everything exported from this file will be available in renderer as global function
// All NodeJS APIs are available in the preload process.

export async function getTopicSidebar() {
  // TODO: use tinybase data
  return {}
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

export async function syncWiki(path: string) {
  const filePaths = await markdownFilePaths(path)
  console.log(filePaths)
}
