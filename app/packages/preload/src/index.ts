// Everything exported from this file will be available in renderer (electron-web)
// Using this import: `import {} from "#preload"`
// All NodeJS APIs are available in preload
// https://github.com/cawa-93/vite-electron-builder#how-it-works

/**
 * @module preload
 */

export { sha256sum } from "./nodeCrypto"
export { versions } from "./versions"
import { createQueries } from "tinybase/cjs"
import { setupTinybaseStore } from "./tinybase/tinybase"
import { markdownFilePaths, saveFileToTinybase } from "./tinybase/wiki"
import * as path from "path" // TODO: is this ok import? tree shaken?

// get in-memory javascript store persisted to sqlite
const tinybase = setupTinybaseStore()
const store = tinybase.getStore()

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
  await Promise.all(
    filePaths.map(async (filePath) => {
      await saveFileToTinybase(wikiFolderPath, filePath, tinybase)
    })
  )

  console.log(tinybase.getStore().getTables(), "Tables are loaded")
  await tinybase.save() // and saved to sqlite
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

// get all topics from tinybase for wiki sidebar
export async function getTopicsSidebar() {
  // TODO: there is def a better way to do this
  // need to get all values of a column for a table

  const topics = tinybase.getStore().getTable("topics")
  let sidebarTopics: string[] = []
  Object.entries(topics).forEach(([key, value]) => {
    // console.log(key, "key")
    // console.log(value, "value")
    sidebarTopics.push(value.prettyName)
  })
  return sidebarTopics
}

export async function getTopic(topic: string) {
  const queries = createQueries(tinybase.getStore())

  queries.setQueryDefinition(
    "getFileContent",
    "topics",
    ({ select, where }) => {
      select("fileContent")
      where("prettyName", topic)
    }
  )

  const fileContent = queries.getResultRow("getFileContent", "fileContent")
  // const fileContent = queries.getResultTable("getFileContent")
  console.log(fileContent, "file content")
  // console.log(Object.entries(fileContent)[1])

  // return {
  //   fileContent: fileContent,
  // }
}

export async function getUserDetails() {
  // TODO: use tinybase to get all user content

  // hardcoding values for now
  return {
    topicToEdit: "SQLite",
    wikiFolderPath: "some/path",
  }
}

// delete all tables from tinybase
export async function clearTinybase() {
  store.delTables()
  tinybase.save()
}
