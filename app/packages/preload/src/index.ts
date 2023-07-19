// Everything exported from this file will be available in renderer (electron-web)
// Using this import: `import {} from "#preload"`
// All NodeJS APIs are available in preload
// https://github.com/cawa-93/vite-electron-builder#how-it-works

/**
 * @module preload
 */

export { sha256sum } from "./nodeCrypto"
export { versions } from "./versions"
import { setupTinybaseStore } from "./tinybase/tinybase"
import { markdownFilePaths, saveFileToTinybase } from "./tinybase/wiki"
import * as path from "path" // TODO: is this ok import? tree shaken?

// get in-memory javascript store persisted to sqlite
const tinybase = setupTinybaseStore()

// this function assumes `pnpm dev-setup` was ran
// and there is `seed` folder present at root
// it will load all the .md files from seed/wiki/nikita into tinybase
export async function syncWikiFromSeed() {
  // using the directory of this file, gets the path to the seed folder
  let fileDirectoryPath = __dirname
  const repoDir = fileDirectoryPath.replace("/app/packages/preload/dist", "")
  const wikiFolderPath = path.join(repoDir, "seed/wiki/nikita")

  // TODO: check this folder exists before running below
  // if it does not return early with message and show error in UI
  // or git clone into seed folder automatically

  // get all file paths of .md files inside the folder
  const filePaths = await markdownFilePaths(wikiFolderPath)
  // save each file to tinybase
  filePaths.map((filePath) => {
    saveFileToTinybase(wikiFolderPath, filePath, tinybase)
  })
}

// load all the .md files from folder path into tinybase
export async function syncWiki(wikiFolderPath: string) {
  // get all file paths of .md files inside the folder
  const filePaths = await markdownFilePaths(wikiFolderPath)
  // save each file to tinybase
  filePaths.map((filePath) => {
    saveFileToTinybase(wikiFolderPath, filePath, tinybase)
  })
}

export async function getTopicsSidebar() {
  console.log(tinybase.getStore().getTable("topics"), "topics")
}

export async function getTopic(topic: string) {
  // TODO: use tinybase to get content of topic

  // hardcoding values for now
  return {
    fileContent: `
    # [SQLite](https://www.sqlite.org/index.html)

    SQLite is great.
    `,
    topicName: "sqlite",
  }
}

export async function getUserDetails() {
  // TODO: use tinybase to get all user content

  // hardcoding values for now
  return {
    topicToEdit: "SQLite",
    wikiFolderPath: "some/path",
  }
}
