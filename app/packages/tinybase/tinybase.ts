import { createQueries, createStore } from "tinybase"
import { readFile } from "node:fs/promises"

//

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

export async function setupTinybaseStore() {
  const store = createStore()
  store.setTablesSchema({
    topics: {
      filePath: { type: "string" },
      fileContent: { type: "string" },
      topicName: { type: "string" },
      topicContent: { type: "string" },
      // notes: { type: "" }, // TODO: can't do array of objects?
      // links: { type: "" }, // TODO: can't do array of objects?
    },
  })
  return store
}

export async function saveFileContent(path: string) {
  const fileContent = await readFile(path, { encoding: "utf8" })
}
