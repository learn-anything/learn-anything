import { setupTinybaseStore } from "~/packages/preload/src/tinybase/tinybase"
import { markdownFilePaths } from "~/packages/preload/src/tinybase/wiki"

// this file is ran via `pnpm app:node-test`
// ideally with a watcher so it reruns on file change
// it's quicker to iterate on node.js this way
// editor on left, terminal on right, save file, see output instantly

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
