import { createStore } from "tinybase"
import { readFile } from "node:fs/promises"
import { markdownFilePaths } from "./wiki"

const store = createStore().setValuesSchema({
  filePath: { type: "string" },
  topicName: { type: "string" },
  content: { type: "string" },
})

export async function saveFileContent(path: string) {
  const fileContent = await readFile(path, { encoding: "utf8" })
  store.setValues({
    filePath: path,
    topicName: "karabiner",
    content: fileContent,
  })
  console.log(fileContent)
}

export async function getTopic() {
  console.log(store.getValues())
}

// requires you to run `pnpm seed-clone` first
// sync content of wiki folder to tinybase
// puts all markdown files into tinybase sqlite db
export async function wikiSync() {
  const wikiPath = new URL("../../../seed/wiki/nikita", import.meta.url)
    .pathname
  const files = await markdownFilePaths(wikiPath)
  console.log(files[0])
  // console.log(files, "files")
  // mdFileIntoTopic(files[0])
}

async function main() {
  wikiSync()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
