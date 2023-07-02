import * as fs from "fs"
import { readFile } from "fs/promises"
import * as path from "path"
import { basename, dirname } from "path"
import { addTopic } from "../topic"
import { getUserIdByName } from "../user"

export async function syncWiki() {}

// overwrite topics on server with local files
export async function forceWikiSync(userId: string) {
  let fileIgnoreList = ["readme.md"]
  const wikiPath = "/Users/nikiv/src/docs/wiki/docs"
  const files = await markdownFilePaths(wikiPath, fileIgnoreList)
  if (files.length > 0) {
    await mdFileIntoTopic(files[0], userId, wikiPath)
    // for (const file of files) {
    //   await mdFileIntoTopic(file, userId)
    // }
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

function isParentFolder(firstPath: string, secondPath: string) {
  const absoluteFirstPath = path.resolve(firstPath)
  const absoluteSecondParentPath = path.resolve(path.dirname(secondPath))
  return absoluteSecondParentPath.startsWith(absoluteFirstPath)
}

function getFolderNameOfFileFromPath(filePath: string) {
  let dirPath = path.dirname(filePath)
  let folderName = path.basename(dirPath)
  return folderName
}

function getFolderPathOfFileFromPath(filePath: string) {
  let dirPath = dirname(filePath)
  return dirPath
}

async function mdFileIntoTopic(
  filePath: string,
  userId: string,
  rootPath: string
) {
  let parentTopic
  console.log(rootPath, "root path")
  console.log(filePath, "file path")
  console.log(getFolderNameOfFileFromPath(filePath))
  console.log(getFolderPathOfFileFromPath(filePath))
  // console.log(isParentFolder(rootPath, filePath))
  return
  const data = (await readFile(filePath)).toString()
  let directory = path.dirname(filePath)
  let directoryName = path.basename(directory)
  console.log(directoryName, "directory name")
  console.log(rootPath)

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
    console.log(parentDirName)
    // console.log(title, "title")
    // console.log(data, "content")
    // console.log(userId, "user id")
    // await addTopic({ name: title, content: data }, userId)
  }
}
