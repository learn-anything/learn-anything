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

function getWikiFolderPath() {
  let fileDirectoryPath = __dirname
  return fileDirectoryPath.replace("/app/test", "/seed/wiki/nikita")
}

test("parse markdown file", async () => {
  const wikiFolderPath = getWikiFolderPath()

  const filePaths = await markdownFilePaths(wikiFolderPath)
  const filePath = filePaths[0]

  const fileContent = (await readFile(filePath)).toString()

  const tree = fromMarkdown(fileContent)

  for (const node of tree.children) {
    console.log(toString(node), "node")
  }

  // TODO: does not save to sqlite when run with bun at least
  tinybase.getStore().addRow("wiki", {
    wikiFolderPath: wikiFolderPath,
  })

  // expect(wikiFolderPath).toBe(
  //   "/Users/nikiv/src/app/learn-anything/seed/wiki/nikita"
  // )
})
