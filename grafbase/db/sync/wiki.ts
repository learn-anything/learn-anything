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
  return dirname(filePath)
}

function getFileNameWithoutExtension(filePath: string) {
  return path.parse(filePath).name
}

async function mdFileIntoTopic(
  filePath: string,
  userId: string,
  rootPath: string
) {
  const topicName = getFileNameWithoutExtension(filePath) // file name is topic name
  console.log(topicName, "topic name")
  let parentTopic
  let content
  let notes = []
  let links = []
  console.log(rootPath, "root path")
  console.log(filePath, "file path")

  const fileContent = (await readFile(filePath)).toString()
  let directory = path.dirname(filePath)
  let directoryName = path.basename(directory)

  // Extract title from frontmatter
  const frontmatterMatch = fileContent.match(
    /^---\n(?:.*\n)*title: (.*)\n(?:.*\n)*---/m
  )
  // If title is not found in frontmatter, extract it from first heading
  let title = frontmatterMatch ? frontmatterMatch[1] : ""
  if (!title) {
    let titleMatch = fileContent.match(/^# \[(.*)\]\(.*\)$/m)
    if (!titleMatch) {
      // If title is not a markdown link, fallback to previous regex
      titleMatch = fileContent.match(/^# (.*)$/m)
    }
    title = titleMatch ? titleMatch[1] : ""
  }
  console.log(title, "title")

  const topicFolderPath = getFolderPathOfFileFromPath(filePath)
  console.log(topicFolderPath, "topic folder path")
  const parentFolderName = path.basename(topicFolderPath)
  console.log(parentFolderName, "parent folder name")
  // if file name is same as folder name
  // means parent topic can be one level up
  if (parentFolderName === topicName) {
    console.log("HIT THIS")
    const parentFolderPath = getFolderPathOfFileFromPath(topicFolderPath)
    if (parentFolderPath === rootPath) {
      console.log("no parent topic")
      parentTopic = null
    }
    console.log(parentFolderPath, "parent folder path")
    const parentFolderName = path.basename(parentFolderPath)
    console.log(parentFolderName, "parent folder name")
    parentTopic = parentFolderName
    console.log(parentTopic, "parent topic")
  }

  return
  if (title) {
    const parentDirName = basename(dirname(filePath))
    console.log(parentDirName)
    // console.log(title, "title")
    // console.log(data, "content")
    // console.log(userId, "user id")
    // await addTopic({ name: title, content: data }, userId)
  }
}
