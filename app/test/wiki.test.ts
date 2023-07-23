import { setupTinybaseStore } from "~/packages/preload/src/tinybase/tinybase"
import { markdownFilePaths } from "~/packages/preload/src/tinybase/wiki"
// TODO: no idea why this errors
// @ts-ignore
import { expect, test } from "bun:test"

// this file is ran via `pnpm app:test`
// ideally with a watcher so it reruns on file change
// it's quicker to iterate this way
// editor on left, terminal on right, save file, see output instantly
// https://bun.sh is used by default as its faster

const tinybase = setupTinybaseStore()
const store = tinybase.getStore()

function parseMarkdownFile(filePath: string) {
  console.log(filePath, "file path")
}

function getWikiFolderPath() {
  let fileDirectoryPath = __dirname
  return fileDirectoryPath.replace("/app/test", "/seed/wiki/nikita")
}

test("parse markdown file", () => {
  const wikiFolderPath = getWikiFolderPath()
  expect(wikiFolderPath).toBe(
    "/Users/nikiv/src/app/learn-anything/seed/wiki/nikita"
  )
})
