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
import * as path from "path"

const tinybase = setupTinybaseStore()

export async function syncWiki(wikiPath: string) {
  // const db = await getDb()

  const filePaths = await markdownFilePaths(wikiPath)
  filePaths.map((filePath) => {
    saveFileToTinybase(wikiPath, filePath, tinybase)
  })
}

// below code assumes `pnpm dev-setup` was ran
// and there is `seed` folder present at root
// it will load all the files from seed/wiki/nikita into tinybase
export async function syncWikiFromSeed() {
  // const db = await getDb()

  // using the directory of this file, gets the path to the seed folder
  let fileDirectoryPath = __dirname
  const repoDir = fileDirectoryPath.replace("/app/packages/preload/dist", "")
  const wikiPath = path.join(repoDir, "seed/wiki/nikita")

  // get all file paths of .md files inside the folder
  const filePaths = await markdownFilePaths(wikiPath)
  // save each file to tinybase
  filePaths.map((filePath) => {
    saveFileToTinybase(wikiPath, filePath, tinybase)
  })
}

export async function getTopicsSidebar() {
  // TODO: I don't know how how to solve it so the db does not get wiped
  // on every time a method from here gets called
  // tinybase should be init only once, then I should be able to
  // do this:
  // const db = await getDb()

  // and use it

  // above await getDb(), does not work
  // I thought to try this instead
  // this should in theory, init tinybase
  // then load tinybase with files from seed folder
  // but for some reason it does not work, getTables() below returns {} but that can't be right
  await syncWikiFromSeed()

  const store = tinybase.getStore()
  // TODO: returns {} for some reason instead of tables
  console.log(store.getTables(), "tables")

  // const db = await getDb()
  // const store = db.getStore()
  // console.log(store.getTables(), "tables")
  // return store.getTable("topics")
}

export async function getTopic(topic: string) {
  // TODO: use tinybase to get content of topic

  // hardcoding values until tinybase is fixed
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

  // TODO: hardcoding values currently until tinybase is fixed
  return {
    topicToEdit: "SQLite",
    wikiFolderPath: "some/path", // TODO: not used currently
  }
}
