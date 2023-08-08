import { readFile } from "fs/promises"
import * as prettier from "prettier"
import * as path from "path"
import * as fs from "fs"
import { Store } from "tinybase/cjs"

export type Wiki = {
  wikiFolderPath: string
  openTopic: Topic
  sidebarTopics: SidebarTopic[] // alphebetically sorted, TODO: maybe make it a memo in store and keep topics only
  topics: string[] // for search TODO: repeats with sidebar topics
  // topics: Topic[]
}

export type SidebarTopic = {
  prettyName: string // assumed unique, used to switch openTopic on click
  indent?: number // indent level
}

export type Topic = {
  topicName: string
  filePath: string
  fileContent: string
  topicContent: string
  prettyName: string
  notes: Note[]
  links: Link[]
}

export type Note = {
  note: string
  subnotes: string[]
  url?: string
  public?: boolean // TODO: should be not optional, temp for testing
}

export type Link = {
  title: string
  url: string
  public?: boolean // TODO: should be not optional, temp for testing
  description?: string
  relatedLinks: RelatedLink[]
}

export type RelatedLink = {
  title: string
  url: string
}

export async function markdownFilePaths(
  directoryPath: string,
  ignoreList: string[] = [],
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

// parse markdown file as a topic
// extract topicName, prettyTopicName, content, notes, links
export async function parseMdFile(filePath: string) {
  // TODO: have to do it like this because doing top level import breaks electron
  // and I need mdast inside electron
  // if you know a way to use this file inside preload/index.ts, please let me know
  const { fromMarkdown } = await import("mdast-util-from-markdown")
  const { toMarkdown } = await import("mdast-util-to-markdown")
  const fileContent = (await readFile(filePath)).toString()
  const tree = fromMarkdown(fileContent)
  // console.log(tree, "tree")

  let topicName = path.basename(filePath, path.extname(filePath))
  let prettyTopicName
  let content = ""
  let notes: Note[] = []
  let links: Link[] = []

  let parsingNotes = false
  let parsingLinks = false
  let parsingFrontMatter = false
  let gotTitleFromFrontMatter = false
  let gotTitle = false

  for (const node of tree.children) {
    // console.log(node, "node")

    // if front matter exists, parse it
    // take the title: value and use it as prettyTopicName
    if (node.type === "thematicBreak") {
      parsingFrontMatter = true
      continue
    }
    if (parsingFrontMatter && node.type === "heading") {
      // TODO: how to do this type safe way?
      prettyTopicName = node.children[0].value.replace("title: ", "")
      parsingFrontMatter = false
      gotTitleFromFrontMatter = true
      continue
    }
    // if front matter doesn't exist, take the first heading as prettyTopicName
    if (
      !gotTitle &&
      !gotTitleFromFrontMatter &&
      node.type === "heading" &&
      node.depth === 1
    ) {
      // TODO: how to going into children in type safe way? check if children exist first?
      // if # [Heading](url)
      if (node.children[0]?.children) {
        prettyTopicName = node.children[0].children.value
        content = content + toMarkdown(node)
      } else {
        // if # Heading
        prettyTopicName = node.children[0].value
        content = content + toMarkdown(node)
      }

      gotTitle = true
      continue
    }
    // console.log(node, "node")

    // TODO: this is messy
    // but the idea is that if ## Notes is found
    // it will start parsing ## Notes
    if (parsingNotes) {
      // console.log(node, "node")

      // if ## Links is found after ## Notes
      // stop processing notes and start processing links
      // TODO: super messy, very similar code appears below too
      if (
        node.type === "heading" &&
        node.depth === 2 &&
        // TODO: is there a nice type safe way to get value of nodes?
        node.children[0]?.value === "Links"
      ) {
        parsingNotes = false
        parsingLinks = true
        continue
      }

      // process all the notes as bullet points
      if (node.type === "list") {
        node.children.forEach(async (note) => {
          let noteAsMarkdown = ""
          let subnotes: string[] = []

          // noteUrl is
          // if note is this
          // [Link only](https://learn-anything.xyz)
          // then noteUrl is https://learn-anything.xyz
          // in all other cases noteAsMarkdown is markdown string of the note
          // this is useful as then a note can be instantly clickable with a link
          let noteUrl

          const noteContent = note.children

          // there are subnotes
          if (noteContent.length > 1) {
            noteAsMarkdown = toMarkdown(noteContent[0])
            noteContent.forEach((note, i) => {
              if (i > 0) {
                note.children.forEach((subnote) => {
                  subnotes.push(
                    toMarkdown(subnote.children[0].children[0]).replace(
                      "\n",
                      "",
                    ),
                  )
                })
              }
            })
          }
          // no subnotes
          else {
            noteAsMarkdown = toMarkdown(noteContent[0])
          }

          // detect that noteAsMarkdown is a link
          // so only matches if it is
          // [Link](url)
          // text with [Link](url)
          // won't count
          const markdownLinkRegex = /^\[[^\]]+\]\([^)]+\)$/
          if (markdownLinkRegex.test(noteAsMarkdown.replace("\n", ""))) {
            noteUrl = noteAsMarkdown.split("(")[1].split(")")[0]
            noteAsMarkdown = noteAsMarkdown.split("[")[1].split("]")[0]
          }
          notes.push({
            note: noteAsMarkdown.replace("\n", ""),
            subnotes,
            url: noteUrl,
          })
        })
      }
      continue
    }

    // parsing ## Links
    if (parsingLinks) {
      // process all the links as bullet points
      if (node.type === "list") {
        node.children.forEach((link) => {
          let linkTitle = ""
          let linkUrl = ""
          let linkDescription = ""
          let relatedLinks: { title: string; url: string }[] = []

          const linkContent = link.children
          // console.log(linkContent, "link content")
          linkContent.forEach((link) => {
            // console.log(link, "link")

            link.children.forEach((linkDetail) => {
              // example url:
              // - [Hope UI](https://github.com/fabien-ml/hope-ui) - SolidJS component library you've hoped for. ([Docs](https://hope-ui.com/docs/getting-started))
              // position.start.column needed because you need to make sure that
              // it does not catch [Docs](..) as a link here
              // 2nd url that appears as () is related link instead
              // TODO: is there nicer way?
              if (
                linkDetail.type === "link" &&
                linkDetail.position.start.column < 15
              ) {
                linkTitle = linkDetail.children[0].value
                linkUrl = linkDetail.url
              }
              // capture description
              // in above example, this will be
              // SolidJS component library you've hoped for.
              else if (linkDetail.type === "text") {
                // description starts with Capital letter
                // and ends with a .
                // strip all else
                // TODO: hacky way to not replace linkDescription with stray ( symbols
                if (linkDetail.value.length > 5) {
                  linkDescription = linkDetail.value.replace(
                    /^[^a-zA-Z]+|[\s(]+$/g,
                    "",
                  )
                }
              }
              // capture related links
              // in above example, this will be
              // ([Docs](https://hope-ui.com/docs/getting-started))
              // where Docs is title
              // https://hope-ui.com/docs/getting-started is url
              // there can be more than 1 related link
              else if (
                linkDetail.type === "link" &&
                linkDetail.position.start.column > 15
              ) {
                relatedLinks.push({
                  title: linkDetail.children[0].value,
                  url: linkDetail.url,
                })
              }
            })
            links.push({
              title: linkTitle,
              url: linkUrl,
              description: linkDescription,
              relatedLinks,
            })
          })
        })
      }
      continue
    }

    // everything until ## Notes is found is content
    if (
      node.type === "heading" &&
      node.depth === 2 &&
      // TODO: how to make type safe?
      node.children[0]?.value === "Notes"
    ) {
      parsingNotes = true
      continue
    }

    // everything until ## Links is found is content (or potentially Notes)
    // assumes that ## Links heading won't go before ## Notes
    if (
      node.type === "heading" &&
      node.depth === 2 &&
      node.children[0]?.value === "Links"
    ) {
      parsingLinks = true
      continue
    }

    // parse content
    // TODO: it eats empty lines in between paragraphs
    // also it currently skips any ## Heading inside `content`
    // they should be included
    content = content + toMarkdown(node)
  }

  // prettier format
  content = await prettier.format(content, {
    parser: "markdown",
  })
  content = content.replace("\n", "")

  // console.log(topicName, "topic name")
  // console.log(prettyTopicName, "pretty topic name")
  // console.log(content, "content")
  // console.log(notes, "notes")
  // console.log(links, "links")

  return {
    topicName,
    fileContent,
    prettyTopicName,
    content,
    notes,
    links,
  }
}

export async function addMarkdownFileAsTopic(filePath: string, store: Store) {
  const topic = await parseMdFile(filePath)
  store.startTransaction()
  store.setRow("topics", topic.topicName, {
    topicName: topic.topicName,
    filePath: filePath,
    fileContent: topic.fileContent,
    topicContent: topic.content,
    prettyName: topic.prettyTopicName,
  })!

  topic.notes.map((note) => {
    // console.log("adding note", note)
    const noteId = store.addRow("notes", {
      topicId: topic.topicName,
      note: note.note,
      url: note.url ? note.url : "",
    })!
    // console.log(noteId, "note with id added")
    if (note.subnotes.length > 0) {
      note.subnotes.map((subnote) => {
        store.addRow("subnotes", {
          noteId: noteId,
          subnote: subnote,
        })
      })
    }
  })
  topic.links.map((link) => {
    console.log("adding link", link)
    const linkId = store.addRow("links", {
      topicId: topic.topicName,
      title: link.title,
      url: link.url,
      description: link.description ? link.description : "",
    })!
    console.log(linkId, "link with id added")
    if (link.relatedLinks.length > 0) {
      link.relatedLinks.map((relatedLink) => {
        store.addRow("relatedLinks", {
          linkId: linkId,
          title: relatedLink.title,
          url: relatedLink.url,
        })
      })
    }
  })
  store.finishTransaction()
}

// overwrite topic content with new content from the file
export async function updateTopicFromMarkdownFile(
  filePath: string,
  store: Store,
) {
  const topic = await parseMdFile(filePath)

  // TODO: instead of addRow, do setRow
  // TODO: need row id, how to get it nicely?
  // const topicId = store.setRow("topics", {
  //   topicName: topic.topicName,
  //   filePath: filePath,
  //   fileContent: topic.fileContent,
  //   topicContent: topic.content,
  //   prettyName: topic.prettyTopicName,
  // })!
}
