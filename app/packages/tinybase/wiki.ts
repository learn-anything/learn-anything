import * as fs from "fs"
import { readFile } from "fs/promises"
import * as path from "path"
import { dirname } from "path"
import { URL } from "node:url"
import { exec } from "child_process"
import clipboard from "clipboardy"

export interface Link {
  title: string
  url: string
  description: string | null
  public: boolean
  related: RelatedLink[]
}

export interface RelatedLink {
  title: string
  url: string
}

export interface Note {
  content: string
  public: boolean
  url: string | null
}

export interface Topic {
  name: string
  content: string
  parentTopic: string | null
  public: boolean
  notes: Note[]
  links: Link[]
  prettyName: string
}

async function getConnections(filePaths: string[]) {
  const connections = new Map()

  for (const filePath of filePaths) {
    const fileData = await readFile(filePath, "utf8")
    const lines = fileData.split("\n")
    let parsedData = ""

    for (const line of lines) {
      if (line.trim() === "## Notes" || line.trim() === "## Links") break
      parsedData += line + "\n"
    }

    const regex = /\[.*?\]\((.*?\.md)\)/g
    let match

    const fileName = path.basename(filePath, ".md")

    while ((match = regex.exec(parsedData)) !== null) {
      const link = match[1].trim().split(" ")[0]
      if (!link.startsWith("http://") && !link.startsWith("https://")) {
        let linkName
        if (path.basename(link) === "index.md") {
          linkName = path.basename(path.dirname(link))
        } else {
          linkName = path.basename(link, ".md")
        }

        if (!connections.has(fileName)) {
          connections.set(fileName, new Map())
        }
        const fileConnections = connections.get(fileName)
        fileConnections.set(linkName, (fileConnections.get(linkName) || 0) + 1)

        // Reverse connection
        if (!connections.has(linkName)) {
          connections.set(linkName, new Map())
        }
        const reverseConnections = connections.get(linkName)
        reverseConnections.set(
          fileName,
          (reverseConnections.get(fileName) || 0) + 1
        )
      }
    }
  }

  // Convert data to desired format
  const result = []
  for (const [file, links] of connections.entries()) {
    const linksArray = []
    for (const [linkFile, count] of links.entries()) {
      linksArray.push({ file: linkFile, count })
    }
    result.push({ file, links: linksArray })
  }

  const connectionsArray = JSON.stringify(result, null, 2)
  console.log(connectionsArray)
  clipboard.writeSync(connectionsArray)
  return result
}

export async function markdownFilePaths(
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

function extractDescriptionFromLink(line: string) {
  // Match markdown link pattern
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g

  // Remove all the markdown links
  let lineWithoutLinks = line.replace(linkPattern, "").trim()

  // If there is no ' -', return an empty string
  if (!lineWithoutLinks.includes(" -")) {
    return ""
  }

  // Split by the first ' -' and return the second part as the description
  const splitLine = line.split(" -", 2)
  let description = splitLine.length > 1 ? splitLine[1] : ""

  // If description starts with '-  -', remove it
  if (description.startsWith("-  -")) {
    description = description.substring(4).trim() // Changed from replace to substring
  }

  return description.trim()
}

function extractLinks(markdownContent: string) {
  const lines = markdownContent.split("\n")

  const links: Link[] = []

  lines.forEach((line) => {
    // Match markdown link pattern
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
    let match
    let related: RelatedLink[] = []
    let firstLink = true

    // Add all links on the line to the links array or related array
    while ((match = linkPattern.exec(line)) !== null) {
      const [fullMatch, title, url] = match

      // Check if the link is a related link (not the first link on the line)
      if (!firstLink) {
        related.push({ title, url })
      } else {
        links.push({ title, url })
        firstLink = false
      }
    }

    // Add description to the last link added
    if (links.length > 0) {
      const lastLink = links[links.length - 1]
      let description = extractDescriptionFromLink(line)

      // Remove related links from the description
      for (const relatedLink of related) {
        description = description
          .replace(`([${relatedLink.title}](${relatedLink.url}))`, "")
          .trim()
      }

      // If description is '-' or empty, set it to empty string
      if (description === "-" || description === " -  ()") {
        description = ""
      }

      lastLink.description = description

      // Assign related links
      lastLink.related = related
    }
  })

  return links
}

function extractNotes(markdownContent: string) {
  const lines = markdownContent.split("\n")

  const notes: Note[] = []

  lines.forEach((line) => {
    // Match markdown link pattern
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
    let match

    // If the line has a link, parse it and push to notes
    if ((match = linkPattern.exec(line)) !== null) {
      const [fullMatch, content, url] = match
      const contentTrimmed = content.trim().startsWith("-")
        ? content.trim().substring(1).trim()
        : content.trim()

      // Only push if the content is not empty
      if (contentTrimmed !== "") {
        notes.push({ content: contentTrimmed, url })
      }
    }
    // If the line does not have a link, treat it as a note with no URL
    else {
      const lineTrimmed = line.trim().startsWith("-")
        ? line.trim().substring(1).trim()
        : line.trim()

      // Only push if the line is not empty
      if (lineTrimmed !== "") {
        notes.push({ content: lineTrimmed })
      }
    }
  })

  return notes
}

export async function writeToFile(
  filePath: string,
  content: string
): Promise<void> {
  try {
    await fs.promises.writeFile(filePath, content)
    exec(`prettier --write ${filePath}`)
  } catch (err) {
    console.error(`Error writing to file: ${err}`)
  }
}

export async function mdFileIntoTopic(filePath: string, rootPath: string) {
  console.log(filePath, "file path")
  console.log(rootPath, "root path")

  const topicName = getFileNameWithoutExtension(filePath) // file name is topic name (in-this-form)
  console.log(topicName, "topic name")
  let prettyName // pretty name for the topic (user defined)
  let parentTopic
  let content = ""
  let notes: Note[] = []
  let links: Link[] = []

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

  const contentWithoutFrontMatter = fileContent.replace(/---[\s\S]*?---/, "")

  let linksSection
  let notesSection
  let noteOrLinkFound = false

  // Find sections
  const sections = contentWithoutFrontMatter.split("\n## ")
  sections.forEach((section) => {
    if (section.startsWith("Links\n")) {
      linksSection = section.replace("Links\n", "")
      noteOrLinkFound = true
    } else if (section.startsWith("Notes\n")) {
      notesSection = section.replace("Notes\n", "")
      noteOrLinkFound = true
    } else if (!noteOrLinkFound) {
      // If not Notes or Links and no Notes or Links found before, append it to contentSection
      content += (content ? "\n## " : "") + section
    }
  })

  console.log(content, "content")

  // only run if ## Links is present
  if (linksSection) {
    // TODO: why is links any[] and not Link[]?
    links = await extractLinks(linksSection)
    console.log(links, "links")
  }

  // only run if ## Notes is present
  if (notesSection) {
    // TODO: why is notes any[] and not Note[]?
    notes = await extractNotes(notesSection)
    console.log(notes, "notes")
  }
  writeToFile(`/Users/nikiv/Desktop/wiki/${topicName}-content.md`, content)
  writeToFile(
    `/Users/nikiv/Desktop/wiki/${topicName}-notes.md`,
    notes.length + " " + JSON.stringify(notes)
  )
  writeToFile(
    `/Users/nikiv/Desktop/wiki/${topicName}-links.md`,
    links.length + " " + JSON.stringify(links)
  )

  // await addTopic(
  //   {
  //     name: topicName,
  //     content,
  //     parentTopic: parentTopic ?? null,
  //     public: true,
  //     notes: notes.map((note) => ({ ...note, public: false })),
  //     links: links.map((link) => ({ ...link, public: false })),
  //     prettyName,
  //   },
  //   userId
  // )

  return
}
