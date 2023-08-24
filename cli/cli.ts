import { readFile } from "fs/promises"
import * as prettier from "prettier"
import * as path from "path"
import * as fs from "fs"
import { fromMarkdown } from "mdast-util-from-markdown"
import { toMarkdown } from "mdast-util-to-markdown"
import { toString } from "mdast-util-to-string"

// current goal of the CLI is to simply seed LA EdgeDB database with topics
// from a provided folder of markdown files
// https://github.com/learn-anything/seed/tree/main/wiki/nikita is the folder used for seeding
// TODO: adapt this CLI to be used as a way to bootstrap EdgeDB for local development

// see app/src-tauri/crates/wiki/src/lib.rs
// for markdown parsing that will be used in the desktop app

async function main() {
  const paths = await markdownFilePaths("/Users/nikiv/src/sites/wiki")
  const topic = await addMarkdownFileAsTopicToSqlite(paths[0])
  // console.log(topic, "topic")
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
  markdownFileContent: string // full markdown file content for the topic
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
  const markdownFileContent = (await readFile(filePath)).toString()
  const tree = fromMarkdown(markdownFileContent)
  // console.log(tree, "tree")

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
    // example heading:

    if (
      !gotTitle &&
      !gotTitleFromFrontMatter &&
      node.type === "heading" &&
      node.depth === 1 // we only consider # Heading. not ## Heading
    ) {
      // console.log(node, "node")
      // title = node.children[0].children.value
      // content = content + toMarkdown(node)

      // if heading has a link like:
      // # [Learn Anything](https://learn-anything.xyz)
      // then title is Learn Anything
      if (
        node.children.length > 0 &&
        node.children[0].type === "link" &&
        node.children[0].children[0].type === "text"
      ) {
        title = node.children[0].children[0].value
        content = content + toMarkdown(node)
      }
      // if its heading without a link like
      // # Learn Anything
      // then title is Learn Anything
      else if (node.children.length > 0 && node.children[0].type === "text") {
        title = node.children[0].value
        content = content + toMarkdown(node)
      }
      gotTitle = true
      continue
    }

    // parsingNotes is true when `## Notes` heading was reached, parse notes until either ## Links or end of file
    if (parsingNotes) {
      console.log(node, "node")

      // if ## Links is found, stop processing notes and start processing links
      if (
        node.type === "heading" &&
        node.depth === 2 &&
        node.children[0].type === "text" &&
        node.children[0].value === "Links"
      ) {
        parsingNotes = false
        parsingLinks = true
        continue
      }

      // process all the notes as bullet points
      if (node.type === "list") {
        node.children.forEach(async (note) => {
          let noteAsMarkdown = ""
          // TODO: perhaps make it not `subnotes` but just `additionalNotes`?
          // where `additionalNotes` is just markdown string
          // example of subnotes:
          // - note
          //  - subnote is [markdown](https://en.wikipedia.org/wiki/Markdown)
          //  - another subnote
          let subnotes: string[] = []

          // example:
          // - [Acceleration is independent of mass of object.](https://www.reddit.com/r/Physics/comments/iezeqe/gravity/)
          // then noteUrl is https://www.reddit.com/r/Physics/comments/iezeqe/gravity/
          let noteUrl

          if (note.children.length > 1) {
            // if there is a note that is not fully wrapped in a link, it's rendered as markdown
            // example:
            // - [Learn Anything](https://learn-anything.xyz) is great
            // noteAsMarkdown is `[Learn Anything](https://learn-anything.xyz) is great`
            noteAsMarkdown = toMarkdown(node.children[0])
            node.children.forEach((note, i) => {
              if (i > 0) {
                note.children.forEach((subnote) => {
                  if (subnote.type === "list") {
                    subnotes.push(
                      toMarkdown(subnote.children[0].children[0]).replace(
                        "\n",
                        "",
                      ),
                    )
                  }
                })
              }
            })
          }
          // no subnotes
          else {
            noteAsMarkdown = toMarkdown(node.children[0])
          }

          // detect that noteAsMarkdown is a link
          // so only matches if it is
          // [Link](url)
          // text with [Link](url)
          // won't count
          // TODO: very ugly, ideally it goes away if there is no `subnotes`
          // but just `additionalNotes` as mentioned above
          const markdownLinkRegex = /^\[[^\]]+\]\([^)]+\)$/
          if (markdownLinkRegex.test(noteAsMarkdown.replace("\n", ""))) {
            noteUrl = noteAsMarkdown.split("(")[1].split(")")[0]
            noteAsMarkdown = noteAsMarkdown.split("[")[1].split("]")[0]
          }
          notes.push({
            note: noteAsMarkdown.replace("\n", ""),
            subnotes,
            url: noteUrl,
            public: true,
          })
        })
      }
      continue
    }

    // parsingLinks is true when `## Links` heading was reached, parse links until end of file
    if (parsingLinks) {
      if (node.type === "list") {
        node.children.forEach((link) => {
          let linkTitle = ""
          let linkUrl = ""
          let linkDescription = ""
          let relatedLinks: { title: string; url: string }[] = []

          const linkContent = link.children
          linkContent.forEach((link) => {
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

    // once ## Notes is found, start parsing notes
    if (
      node.type === "heading" &&
      node.depth === 2 &&
      node.children[0].type === "text" &&
      node.children[0].value === "Notes"
    ) {
      parsingNotes = true
      continue
    }

    // once ## Links is found, start parsing links
    if (
      node.type === "heading" &&
      node.depth === 2 &&
      node.children[0].type === "text" &&
      node.children[0].value === "Links"
    ) {
      parsingLinks = true
      continue
    }

    // everything excluding `front matter`, `## Notes` and `## Links` is considered `content`
    content = content + toMarkdown(node)
  }

  // prettier format
  content = await prettier.format(content, {
    parser: "markdown",
  })
  content = content.replace("\n", "")

  // console.log(content, "content")

  return {
    title,
    laTopic,
    content,
    notes,
    links,
    public: true, // TODO: it should come from front matter `public: true/false`
    markdownFileContent,
  }
}

export async function addMarkdownFileAsTopicToSqlite(filePath: string) {
  const topic = await parseMdFile(filePath)
  // TODO: add sqlite insert code
  return topic
}
