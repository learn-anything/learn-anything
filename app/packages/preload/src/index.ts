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

// below code assumes `pnpm dev-setup` was ran
// and there is `seed` folder present at root
// it will load all the files from seed/wiki/nikita into tinybase
export async function syncWikiFromSeed() {
  const db = await getDb()

  // using the directory of this file, gets the path to the seed folder
  let fileDirectoryPath = __dirname
  const repoDir = fileDirectoryPath.replace("/app/packages/preload/dist", "")
  const wikiPath = path.join(repoDir, "seed/wiki/nikita")

  // get all file paths of .md files inside the folder
  const filePaths = await markdownFilePaths(wikiPath)
  // save each file to tinybase
  filePaths.map((filePath) => {
    saveFileToTinybase(wikiPath, filePath, db)
  })
  return db
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
  const db = await syncWikiFromSeed()

  const store = db.getStore()
  // TODO: breaks for some reason
  console.log(store.getTables(), "tables")

  // const db = await getDb()
  // const store = db.getStore()
  // console.log(store.getTables(), "tables")
  // return store.getTable("topics")
}

export async function getTopic(topic: string) {
  // TODO: use tinybase data, broken now
  // const db = await getDb()
  // const store = db.getStore()
  // console.log(db)
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
