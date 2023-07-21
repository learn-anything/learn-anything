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

// TODO: remove from prod builds
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
  // create sidebar, like one below:
  // [ { prettyName: 'Analytics', indent: 0 }, { prettyName: 'Grafana', indent: 1 }]

  // const sidebar =

  store.addRow("wiki", {
    wikiFolderPath: wikiFolderPath,
  })

  console.log(tinybase.getStore().getTables(), "tables are loaded")
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
    console.log(value, "value")
    // TODO: fix type, go through Cell to value?
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

// TODO: remove from prod builds
// delete all tables from tinybase
export async function clearTinybase() {
  store.delTables()
  console.log("all tables deleted")
}

export async function initUserStore() {
  const userDetails = await getUserDetails()
  const topic = await getTopic(userDetails.topicToEdit)
  const sidebarTopics = await getTopicsSidebar()

  return {
    userDetails,
    topic,
    sidebarTopics,
  }
}

type Wiki = {
  wikiFolderPath: string
  openTopic: OpenTopic
}

type OpenTopic = {
  topicName: string
  filePath: string
  fileContent: string
  topicContent: string
  prettyName: string
  notes: Note[]
  links: Link[]
}

type Note = {
  content: string
  url: string
  public: boolean
}

type Link = {
  title: string
  url: string
  public: boolean
}

// TODO: import type Wiki currently defined in GlobalContext/wiki.ts
// move the types to some shared package so types can be used
// in both here and electron-web
export async function updateWiki(wiki: Wiki) {
  // console.log(wiki, "wiki")
  // assumes there is only one row in wiki table
  // and that the row exists
  // store.setRow("wiki", "0", {
  //   wikiFolderPath: wiki.wikiFolderPath,
  // })
  // store.setRow('topics', '')
}

// TODO: remove from prod builds
// this function runs on every refresh of electron-web
// or if you edit code anywhere in preload
// can use it to run/test some code from electron node.js side more easily
export async function devTest() {
  const topics = tinybase.getStore().getTable("topics")
  console.log(topics, "topics")
}
