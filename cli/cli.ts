import { readFile } from "fs/promises"
import * as prettier from "prettier"
import * as path from "path"
import * as fs from "fs"
import { fromMarkdown } from "mdast-util-from-markdown"
import { toMarkdown } from "mdast-util-to-markdown"
import { toString } from "mdast-util-to-string"

// current goal of the CLI is to simply seed LA EdgeDB database with topics
// from a provided folder of markdown files
// this CLI will also be used as a way to bootstrap EdgeDB for local development

// see app/src-tauri/crates/wiki/src/lib.rs
// for markdown parsing that will be used in the desktop app

async function main() {
  const paths = await markdownFilePaths("/Users/nikiv/src/sites/wiki")
  const topic = await addMarkdownFileAsTopic(paths[0])
  console.log(topic, "topic")
  // await Promise.all(
  //   paths.map(async (filePath) => {
  //     await addMarkdownFileAsTopic(filePath)
  //   }),
  // )
  // console.log(paths, "paths")
  // const query = db.query("select 'Hello world' as message;")
  // query.get() // => { message: "Hello world" }
  // console.log(query.get())
}

main()

type User = {
  wiki: Wiki
  username: string
}

type Wiki = {
  topics: Topic[]
}

type Topic = {
  title: string // extracted from front matter (i.e. title: Solid) or first heading (if no title: in front matter)
  laTopic: string // topic in LA (i.e. topic name can be 3D Printing but LA topic is 3d-printing)
  public: boolean // extracted from front matter (i.e. public: true/false) if found
  content: string // everything before ## Notes or ## Links (excluding front matter)
  notes: Note[] // everything inside ## Notes heading
  links: Link[] // everything inside ## Links heading
  fileContent: string // full markdown file content for the topic
}

type Note = {
  note: string // note content as markdown
  // example:
  // - This is great note
  //   - This is a subnote
  //   - Another subnote
  subnotes: string[]
  // example:
  // - [Learn Anything](https://learn-anything.xyz)
  public: boolean // default is configurable by user, set to true initially
  url?: string
}

type Link = {
  title: string // link title
  url: string // link url
  public: boolean // default is configurable by user, set to true initially
  // example:
  // - [Learn Anything](https://learn-anything.xyz) - Explore knowledge.
  // `Explore knowledge` is link description
  description?: string
  // example:
  // - [Learn Anything](https://learn-anything.xyz) - Explore knowledge. ([Code](https://github.com/learn-anything/learn-anything.xyz))
  // `[Code](https://github.com/learn-anything/learn-anything.xyz)` is related link
  relatedLinks: RelatedLink[]
}

type RelatedLink = {
  title: string
  url: string
}

// used to generate sidebar in user's wiki pages
type SidebarTopic = {
  title: string // as it's unique, it can be used to create a link to the topic in website
  indent?: number // indent level is used to tell that a topic is a child of another topic
  // TODO: perhaps there is better way to do solve the problem?
}

// Get all the markdown files in a directory
async function markdownFilePaths(
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

// Parse markdown file content into a Topic structure
// assumed structure of most files is:
// optional front matter
// # Heading
// markdown
// ## Optional heading
// more markdown with optional headings
// ## Notes (optional)
// ## Links (optional)
// everything before either ## Notes or ## Links is content
// everything inside ## Notes heading is notes
// everything inside ## Links heading is links
async function parseMdFile(filePath: string) {
  const fileContent = (await readFile(filePath)).toString()
  const tree = fromMarkdown(fileContent)
  console.log(tree)

  // CLI assumes that the file name is LA topic name
  let laTopic = path.basename(filePath, path.extname(filePath))
  let title
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

    // if front matter exists, start parsing it
    if (node.type === "thematicBreak") {
      parsingFrontMatter = true
      continue
    }
    // parse `title: ..` from front matter and use it as title
    if (parsingFrontMatter && node.type === "heading") {
      title = toString(node).replace(/title: /, "")
      parsingFrontMatter = false
      gotTitleFromFrontMatter = true
      continue
    }
    // if front matter doesn't exist, take the first heading as title
    if (
      !gotTitle &&
      !gotTitleFromFrontMatter &&
      node.type === "heading" &&
      node.depth === 1
    ) {
      // example heading:
      // # [Learn Anything](https://learn-anything.xyz)
      if (node.type === "heading") {
        console.log(node, "node")
        title = node.children[0].children.value
        content = content + toMarkdown(node)
        // content =
        //   content +
        //   fileContent.slice(
        //     node.position?.start.offset,
        //     node.position?.end.offset,
        //   )

        // content = content.slice()
      } else {
        // if # Heading
        title = node.children[0].value
        content = content + toMarkdown(node)
        // content =
        //   content +
        //   fileContent.slice(
        //     node.position?.start.offset,
        //     node.position?.end.offset,
        //   )
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

export async function addMarkdownFileAsTopic(filePath: string) {
  const topic = await parseMdFile(filePath)
  console.log(topic, "topic")
  // store.startTransaction()
  // store.setRow("topics", topic.topicName, {
  //   topicName: topic.topicName,
  //   filePath: filePath,
  //   fileContent: topic.fileContent,
  //   topicContent: topic.content,
  //   prettyName: topic.prettyTopicName,
  // })!

  // topic.notes.map((note) => {
  //   // console.log("adding note", note)
  //   const noteId = store.addRow("notes", {
  //     topicId: topic.topicName,
  //     note: note.note,
  //     url: note.url ? note.url : "",
  //   })!
  //   // console.log(noteId, "note with id added")
  //   if (note.subnotes.length > 0) {
  //     note.subnotes.map((subnote) => {
  //       store.addRow("subnotes", {
  //         noteId: noteId,
  //         subnote: subnote,
  //       })
  //     })
  //   }
  // })
  // topic.links.map((link) => {
  //   console.log("adding link", link)
  //   const linkId = store.addRow("links", {
  //     topicId: topic.topicName,
  //     title: link.title,
  //     url: link.url,
  //     description: link.description ? link.description : "",
  //   })!
  //   console.log(linkId, "link with id added")
  //   if (link.relatedLinks.length > 0) {
  //     link.relatedLinks.map((relatedLink) => {
  //       store.addRow("relatedLinks", {
  //         linkId: linkId,
  //         title: relatedLink.title,
  //         url: relatedLink.url,
  //       })
  //     })
  //   }
  // })
  // store.finishTransaction()
}

// overwrite topic content with new content from the file
export async function updateTopicFromMarkdownFile(filePath: string) {
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
