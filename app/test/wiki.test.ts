import { setupTinybaseStore } from "~/packages/preload/src/tinybase/tinybase"
import { markdownFilePaths } from "~/packages/preload/src/tinybase/wiki"
import { expect, test } from "bun:test"

// this file is ran via `pnpm app:test`
// ideally with a watcher so it reruns on file change
// it's quicker to iterate this way
// editor on left, terminal on right, save file, see output instantly
// https://bun.sh is used by default as its faster

const tinybase = setupTinybaseStore()
const store = tinybase.getStore()

// similar function to syncWikiFromSeed in preload/index.ts
async function syncWikiFromSeed() {
  let fileDirectoryPath = __dirname
  const wikiFolderPath = fileDirectoryPath.replace(
    "/app/scripts",
    "/seed/wiki/nikita"
  )
  const filePaths = await markdownFilePaths(wikiFolderPath)

  parseMarkdownFile(filePaths[0])
}

function parseMarkdownFile(filePath: string) {
  console.log(filePath, "file path")
}

async function main() {
  await syncWikiFromSeed()
}

main()

test("2 + 2", () => {
  expect(2 + 2).toBe(4)
})
