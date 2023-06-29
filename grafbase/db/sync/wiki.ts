import { readFile, readdir } from "fs/promises"
import { basename, dirname, extname, join } from "path"

export function syncWiki() {}

// overwrite topics on server with local files
export function forceWikiSync() {
  // createTopic(
  //   { name: "Physics", content: "Physics is fun" },
  //   "4ac43a0c-169f-11ee-93a2-9bad7dd0cab0"
  // )
  let fileIgnoreList = ["readme.md"]
  topicsFromFolder(fileIgnoreList)
}

async function topicsFromFolder(ignoreList?: string[]) {}

async function seedWikiFromFolder(directoryPath: string) {
  const entries = await readdir(directoryPath, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = join(directoryPath, entry.name)
    if (entry.isDirectory()) {
      await seedWikiFromFolder(entryPath)
    } else if (entry.isFile() && extname(entry.name) === ".md") {
      await processFile(entryPath)
    }
  }
}

async function processFile(filePath: string) {
  const data = (await readFile(filePath)).toString()

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
