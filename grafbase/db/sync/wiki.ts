import * as fs from "fs"
import { readFile } from "fs/promises"
import * as path from "path"
import { basename, dirname } from "path"

export async function syncWiki() {}

// overwrite topics on server with local files
export async function forceWikiSync() {
  // createTopic(
  //   { name: "Physics", content: "Physics is fun" },
  //   "4ac43a0c-169f-11ee-93a2-9bad7dd0cab0"
  // )
  let fileIgnoreList = ["readme.md"]
  const files = await markdownFilePaths(
    "/Users/nikiv/src/docs/wiki/docs",
    fileIgnoreList
  )
  if (files.length > 0) {
    processFile(files[0])
  }
}

async function markdownFilePaths(
  directoryPath: string,
  ignoreList: string[] = []
): Promise<string[]> {
  let filesToProcess: string[] = []
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true })

  for (let entry of entries) {
    const fullPath = path.join(directoryPath, entry.name)

    if (entry.isDirectory()) {
      const subDirFiles = await markdownFilePaths(fullPath, ignoreList)
      filesToProcess = [...filesToProcess, ...subDirFiles]
    } else if (
      entry.isFile() &&
      path.extname(entry.name) === ".md" &&
      !ignoreList.includes(entry.name.toLowerCase())
    ) {
      filesToProcess.push(fullPath)
    }
  }
  return filesToProcess
}

// if its index.md, take name of parent folder

// async function processFileAsTopic(filePath: string) {
//   const entries = await readdir(directoryPath, { withFileTypes: true })

//   for (const entry of entries) {
//     const entryPath = join(directoryPath, entry.name)
//     if (entry.isDirectory()) {
//       await seedWikiFromFolder(entryPath)
//     } else if (entry.isFile() && extname(entry.name) === ".md") {
//       await processFile(entryPath)
//     }
//   }
// }

async function processFile(filePath: string) {
  const data = (await readFile(filePath)).toString()
  console.log(data)

  // Extract the title from the frontmatter
  const frontmatterMatch = data.match(
    /^---\n(?:.*\n)*title: (.*)\n(?:.*\n)*---/m
  )

  // If a title is not found in the frontmatter, extract it from the first heading
  let title = frontmatterMatch ? frontmatterMatch[1] : ""
  if (!title) {
    let titleMatch = data.match(/^# \[(.*)\]\(.*\)$/m)
    if (!titleMatch) {
      // If the title is not a markdown link, fallback to previous regex
      titleMatch = data.match(/^# (.*)$/m)
    }
    title = titleMatch ? titleMatch[1] : ""
  }

  if (title) {
    const parentDirName = basename(dirname(filePath))
    // await createTopic()
  }
}
