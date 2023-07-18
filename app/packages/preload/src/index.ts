/**
 * @module preload
 */

export { sha256sum } from "./nodeCrypto"
export { versions } from "./versions"
import { contextBridge } from "electron"

// Everything exported from this file will be available in renderer as global function
// All NodeJS APIs are available in the preload process.

// TODO: use store defined in main process
export async function getTopic(topic: string) {
  return {
    fileContent: `
    # [SQLite](https://www.sqlite.org/index.html)

    SQLite is great.
    `,
    topicName: "sqlite",
  }
}
