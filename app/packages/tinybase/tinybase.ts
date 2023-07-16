import { createStore } from "tinybase"
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
  console.log("run")
}

const store = createStore().setValuesSchema({
  filePath: { type: "string" },
  fileContent: { type: "string" },
  topicName: { type: "string" },
  topicContent: { type: "string" },
  // notes: { type: "array" }, //
  // links: { type: "array" },
})

export async function saveFileContent(path: string) {
  const fileContent = await readFile(path, { encoding: "utf8" })
  store.setValues({
    filePath: path,
    topicName: "karabiner",
    content: fileContent,
  })
  console.log(fileContent)
}

export async function getTopic() {
  console.log(store.getValues())
}
