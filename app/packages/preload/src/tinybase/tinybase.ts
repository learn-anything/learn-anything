import { createStore } from "tinybase/cjs"
import { createSqlite3Persister } from "tinybase/cjs/persisters/persister-sqlite3"
import { Database } from "sqlite3"

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
  const store = createStore().setTablesSchema({
    topics: {
      id: { type: "string" },
      filePath: { type: "string" },
      fileContent: { type: "string" },
      topicName: { type: "string" },
      topicContent: { type: "string" },
    },
    notes: {
      topicId: { type: "string" },
      content: { type: "string" },
      url: { type: "string" },
      public: { type: "boolean" },
    },
    links: {
      topicId: { type: "string" },
      title: { type: "string" },
      url: { type: "string" },
      public: { type: "boolean" },
    },
  })
  const db = new Database("learn-anything")
  const persister = createSqlite3Persister(store, db, {
    mode: "tabular",
    tables: {
      load: {
        topics: "topics",
        notes: "notes",
        links: "links",
      },
      save: {
        topics: "topics",
        notes: "notes",
        links: "links",
      },
    },
  })
  await persister.save()
  return persister
}

// tinybase db
export async function db() {
  const db = await setupTinybaseStore()
  return db
}
