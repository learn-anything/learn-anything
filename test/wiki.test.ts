import { setupTinybaseStore } from "~/packages/preload/src/tinybase/tinybase"
import { markdownFilePaths } from "~/packages/preload/src/tinybase/wiki"
// TODO: no idea why this errors
// @ts-ignore
import { expect, test } from "bun:test"
import { micromark } from "micromark"
import { fromMarkdown } from "mdast-util-from-markdown"
import { readFile } from "fs/promises"
import { toString } from "mdast-util-to-string"

// this file is ran via `bun app:test`
// it's quicker to iterate this way
// editor on left, terminal on right, save file, see test results instantly

const tinybase = setupTinybaseStore()
const store = tinybase.getStore()

function parseMarkdownFile(filePath: string) {
  console.log(filePath, "file path")
}

function getWikiFolderPath(folderName: string) {
  let fileDirectoryPath = __dirname
  return fileDirectoryPath.replace("/app/tests", `/seed/wiki/${folderName}`)
}

function getTestFolderPath() {
  let fileDirectoryPath = __dirname
  return fileDirectoryPath.replace("/app/tests", "/seed/test")
}

test("parse test folder correctly", async () => {
  const testFolderPath = getTestFolderPath()
  console.log(testFolderPath)

  // const fileContent = (await readFile(filePath)).toString()
  // const tree = fromMarkdown(fileContent)
})

// test("parse Nikita's wiki correctly", async () => {
//   const wikiFolderPath = getWikiFolderPath("nikita")
//   const filePaths = await markdownFilePaths(wikiFolderPath)
//   const filePath = filePaths[0]
//   const fileContent = (await readFile(filePath)).toString()
//   const tree = fromMarkdown(fileContent)
//   for (const node of tree.children) {
//     console.log(toString(node), "node")
//   }
//   // TODO: does not save to sqlite when run with bun at least
//   tinybase.getStore().addRow("wiki", {
//     wikiFolderPath: wikiFolderPath,
//   })
// })
