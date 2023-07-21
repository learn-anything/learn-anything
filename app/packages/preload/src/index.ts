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
import { SidebarTopic, Wiki } from "../../../types/wiki"

// get in-memory javascript store persisted to sqlite
const tinybase = setupTinybaseStore()
const store = tinybase.getStore() // TODO: for some reason using store.getTable() will return undefined..

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

// return array of topics with indentation for sidebar
// looks like: [ { prettyName: 'Analytics', indent: 0 }, { prettyName: 'Grafana', indent: 1 }]
export async function getTopicsSidebar() {
  // TODO: there should be a way to return values for a given column only

  const topics = tinybase.getStore().getTable("topics")
  let sidebarTopics: SidebarTopic[] = []
  Object.entries(topics).forEach(([key, value]) => {
    // console.log(key, "key")
    // console.log(value, "value")

    // TODO: fix type, go through Cell to value?
    sidebarTopics.push({ prettyName: value.prettyName, indent: 0 })
  })
  // console.log(sidebarTopics)
  return sidebarTopics
}

// TODO: potentially can load entire state of wiki/tinybase into solid store
// to avoid having to do this
// given prettyName of topic, return full topic details
export async function getTopic(prettyName: string) {
  const topics = tinybase.getStore().getTable("topics")

  const topic = Object.entries(topics).find((topic) => {
    return topic[1].prettyName === prettyName
  })
  if (topic) {
    console.log(topic[1])
    return topic[1]
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
// edit code anywhere in preload/main or do cmd+r in app
// can use it to run/test some code from electron node.js side more easily
export async function devTest() {
  // await getTopicsSidebar()
  await getTopic("SQLite")
}
