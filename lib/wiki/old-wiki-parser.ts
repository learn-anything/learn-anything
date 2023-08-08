// TODO: old code, not used anymore
// keeping commented for now

// import { exec } from "child_process"
// import * as fs from "fs"
// import { readFile } from "fs/promises"
// import * as path from "path"
// import { dirname } from "path"
// import { Persister, Store } from "tinybase/cjs"

// type RelatedLink = {
//   title: string
//   url: string
// }

// // TODO: add proper test cases and different files
// // currently it fails to do right thing on many files

// // given path to file, save it to tinybase
// export async function saveFileToTinybase(
//   wikiFolderPath: string,
//   filePath: string,
//   tinybase: Persister
// ) {
//   console.log(filePath, "file path")
//   const topicName = getFileNameWithoutExtension(filePath) // file name is topic name (in-this-form)
//   // console.log(topicName, "topic name")
//   let prettyName // pretty name for the topic (user defined)
//   let parentTopic
//   let content = ""
//   let notes: Note[] = []
//   let links: Link[] = []

//   const fileContent = (await readFile(filePath)).toString()

//   // Extract title from frontmatter
//   const frontmatterMatch = fileContent.match(
//     /^---\n(?:.*\n)*title: (.*)\n(?:.*\n)*---/m
//   )
//   // If title is not found in frontmatter, extract it from first heading
//   let title = frontmatterMatch ? frontmatterMatch[1] : ""
//   if (!title) {
//     let titleMatch = fileContent.match(/^# \[(.*)\]\(.*\)$/m)
//     if (!titleMatch) {
//       // If title is not a markdown link, fallback to previous regex
//       titleMatch = fileContent.match(/^# (.*)$/m)
//     }
//     title = titleMatch ? titleMatch[1] : ""
//   }
//   prettyName = title // either # Heading or title: Frontmatter

//   // Find the topic's parent if it exists
//   const topicFolderPath = getFolderPathOfFileFromPath(filePath)
//   // console.log(topicFolderPath, "topic folder path")
//   const parentFolderName = path.basename(topicFolderPath)
//   // console.log(parentFolderName, "parent folder name")

//   // if file name is same as folder name
//   // means parent topic can be one level up
//   if (parentFolderName === topicName) {
//     // const parentFolderPath = getFolderPathOfFileFromPath(topicFolderPath)
//     // this is true only if the parent folder is not root folder
//     // if (!(parentFolderPath === wikiPath)) {
//     //   console.log("not root folder, there is parent available")
//     // }
//     // console.log("no parent!")
//   } else {
//     parentTopic = parentFolderName
//   }
//   // console.log(parentTopic, "parent topic")

//   const contentWithoutFrontMatter = fileContent.replace(/---[\s\S]*?---/, "")

//   let linksSection
//   let notesSection
//   let noteOrLinkFound = false

//   // Find sections
//   const sections = contentWithoutFrontMatter.split("\n## ")
//   sections.forEach((section) => {
//     if (section.startsWith("Links\n")) {
//       linksSection = section.replace("Links\n", "")
//       noteOrLinkFound = true
//     } else if (section.startsWith("Notes\n")) {
//       notesSection = section.replace("Notes\n", "")
//       noteOrLinkFound = true
//     } else if (!noteOrLinkFound) {
//       // If not Notes or Links and no Notes or Links found before, append it to contentSection
//       content += (content ? "\n## " : "") + section
//     }
//   })

//   tinybase.getStore().startTransaction()
//   const topicId = tinybase.getStore().addRow("topics", {
//     topicName: topicName,
//     filePath: filePath,
//     fileContent: fileContent,
//     topicContent: content,
//     prettyName: prettyName,
//     parentTopic: parentTopic ? parentTopic : "",
//   })!

//   // only run if ## Links is present
//   if (linksSection) {
//     await addLinksFromMarkdownContent(
//       linksSection,
//       tinybase.getStore(),
//       topicId
//     )
//   }

//   // only run if ## Notes is present
//   if (notesSection) {
//     await addNotesFromMarkdownContent(
//       notesSection,
//       tinybase.getStore(),
//       topicId
//     )
//   }
//   tinybase.getStore().finishTransaction()

//   return
// }

// function getFolderPathOfFileFromPath(filePath: string) {
//   return dirname(filePath)
// }

// function getFileNameWithoutExtension(filePath: string) {
//   return path.parse(filePath).name
// }

// function extractDescriptionFromLink(line: string) {
//   // Match markdown link pattern
//   const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g

//   // Remove all the markdown links
//   let lineWithoutLinks = line.replace(linkPattern, "").trim()

//   // If there is no ' -', return an empty string
//   if (!lineWithoutLinks.includes(" -")) {
//     return ""
//   }

//   // Split by the first ' -' and return the second part as the description
//   const splitLine = line.split(" -", 2)
//   let description = splitLine.length > 1 ? splitLine[1] : ""

//   // If description starts with '-  -', remove it
//   if (description.startsWith("-  -")) {
//     description = description.substring(4).trim() // Changed from replace to substring
//   }

//   return description.trim()
// }

// function addLinksFromMarkdownContent(
//   markdownContent: string,
//   store: Store,
//   topicId: string
// ) {
//   const lines = markdownContent.split("\n")

//   const links: Link[] = []

//   lines.forEach((line) => {
//     // Match markdown link pattern
//     const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
//     let match
//     let related: RelatedLink[] = []
//     let firstLink = true

//     // Add all links on the line to the links array or related array
//     while ((match = linkPattern.exec(line)) !== null) {
//       const [fullMatch, title, url] = match

//       // Check if the link is a related link (not the first link on the line)
//       if (!firstLink) {
//         related.push({ title, url })
//       } else {
//         store.addRow("links", {
//           topicId: topicId,
//           title: title,
//           url: url,
//         })
//         firstLink = false
//       }
//     }

//     // Add description to the last link added
//     if (links.length > 0) {
//       const lastLink = links[links.length - 1]
//       let description = extractDescriptionFromLink(line)

//       // Remove related links from the description
//       for (const relatedLink of related) {
//         description = description
//           .replace(`([${relatedLink.title}](${relatedLink.url}))`, "")
//           .trim()
//       }

//       // If description is '-' or empty, set it to empty string
//       if (description === "-" || description === " -  ()") {
//         description = ""
//       }

//       lastLink.description = description

//       // Assign related links
//       lastLink.related = related
//     }
//   })

//   return links
// }

// function addNotesFromMarkdownContent(
//   markdownContent: string,
//   store: Store,
//   topicId: string
// ) {
//   const lines = markdownContent.split("\n")

//   // const notes: Note[] = []

//   lines.forEach((line) => {
//     // Match markdown link pattern
//     const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
//     let match

//     // If the line has a link, parse it and push to notes
//     if ((match = linkPattern.exec(line)) !== null) {
//       const [fullMatch, content, url] = match
//       const contentTrimmed = content.trim().startsWith("-")
//         ? content.trim().substring(1).trim()
//         : content.trim()

//       // Only push if the content is not empty
//       if (contentTrimmed !== "") {
//         store.addRow("notes", {
//           topicId: topicId,
//           content: contentTrimmed,
//           url: url,
//         })
//         // @ts-ignore
//         // notes.push({ content: contentTrimmed, url })
//       }
//     }
//     // If the line does not have a link, treat it as a note with no URL
//     else {
//       const lineTrimmed = line.trim().startsWith("-")
//         ? line.trim().substring(1).trim()
//         : line.trim()

//       // Only push if the line is not empty
//       if (lineTrimmed !== "") {
//         store.addRow("notes", {
//           topicId: topicId,
//           content: lineTrimmed,
//         })
//         // @ts-ignore
//         // notes.push({ content: lineTrimmed })
//       }
//     }
//   })
// }

// export async function writeToFile(
//   filePath: string,
//   content: string
// ): Promise<void> {
//   try {
//     await fs.promises.writeFile(filePath, content)
//     exec(`prettier --write ${filePath}`)
//   } catch (err) {
//     console.error(`Error writing to file: ${err}`)
//   }
// }

// export async function markdownFilePaths(
//   directoryPath: string,
//   ignoreList: string[] = []
// ): Promise<string[]> {
//   let filesToProcess: string[] = []
//   const entries = fs.readdirSync(directoryPath, { withFileTypes: true })

//   for (let entry of entries) {
//     const fullPath = path.join(directoryPath, entry.name)

//     if (entry.isDirectory()) {
//       const subDirFiles = await markdownFilePaths(fullPath, ignoreList)
//       filesToProcess = [...filesToProcess, ...subDirFiles]
//     } else if (
//       entry.isFile() &&
//       path.extname(entry.name) === ".md" &&
//       !ignoreList.includes(entry.name.toLowerCase())
//     ) {
//       filesToProcess.push(fullPath)
//     }
//   }
//   return filesToProcess
// }
