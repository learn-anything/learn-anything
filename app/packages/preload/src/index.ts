/**
 * @module preload
 */

export { sha256sum } from "./nodeCrypto"
export { versions } from "./versions"
import { db } from "./tinybase/tinybase"

// Everything exported from this file will be available in renderer as global function
// All NodeJS APIs are available in the preload process.

export async function getTopicSidebar() {
  console.log(db, "db")
  return {
    fileContent: `
    # [SQLite](https://www.sqlite.org/index.html)

    SQLite is great.
    `,
    topicName: "sqlite",
  }
}

export async function getTopic(topic: string) {
  return {
    fileContent: `
    # [SQLite](https://www.sqlite.org/index.html)

    SQLite is great.
    `,
    topicName: "sqlite",
  }
}
