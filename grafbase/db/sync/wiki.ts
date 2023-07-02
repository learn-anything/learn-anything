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

function extractLinks(markdownContent: string) {
  // Find the part of the content under "## Links"
  const linksSection = markdownContent.split("## Links\n")[1]

  // Separate each line
  const lines = linksSection.split("\n")

  const links = []

  lines.forEach((line) => {
    // Match markdown link pattern
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
    let match
    const related = []

    // Add all links on the line to the links array or related array
    while ((match = linkPattern.exec(line)) !== null) {
      const [fullMatch, title, url] = match

      // Check if the link is a related link (appears after a ".")
      if (line.indexOf(fullMatch) > line.lastIndexOf(". ")) {
        related.push({ title, url })
      } else {
        links.push({ title, url })
      }
    }

    // Add description to the last link added
    if (links.length > 0) {
      const lastLink = links[links.length - 1]
      lastLink.description = line
        .replace(linkPattern, "") // Remove links from the line
        .trim() // Remove leading and trailing whitespace
        .replace(/^- /, "") // Remove potential leading "- "

      // Add related links if they exist
      if (related.length > 0) {
        lastLink.related = related
      }
    }
  })

  return links
}

async function mdFileIntoTopic(
  filePath: string,
  userId: string,
  rootPath: string
) {
  console.log(filePath, "file path")
  console.log(rootPath, "root path")

  const topicName = getFileNameWithoutExtension(filePath) // file name is topic name (in-this-form)
  console.log(topicName, "topic name")
  let prettyName // pretty name for the topic (user defined)
  let parentTopic
  let content
  let notes = []
  let links = []

  const fileContent = (await readFile(filePath)).toString()

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
  prettyName = title // either # Heading or title: Frontmatter

  // Find the topic's parent if it exists

  const topicFolderPath = getFolderPathOfFileFromPath(filePath)
  console.log(topicFolderPath, "topic folder path")
  const parentFolderName = path.basename(topicFolderPath)
  console.log(parentFolderName, "parent folder name")

  // if file name is same as folder name
  // means parent topic can be one level up
  if (parentFolderName === topicName) {
    const parentFolderPath = getFolderPathOfFileFromPath(topicFolderPath)
    // this is true only if the parent folder is not root folder
    if (!(parentFolderPath === rootPath)) {
      console.log("not root folder, there is parent available")
    }
    console.log("no parent!")
  } else {
    parentTopic = parentFolderName
  }

  console.log(parentTopic, "parent topic")

  console.log(fileContent)

  const contentWithoutFrontMatter = fileContent.replace(/---[\s\S]*?---/, "")
  console.log(contentWithoutFrontMatter)

  links = await extractLinks(contentWithoutFrontMatter)
  console.log(links)
  console.log(links.length)

  // run prettier on file to get formatting good
  return
}
