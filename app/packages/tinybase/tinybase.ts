import { Store, createQueries, createStore } from "tinybase"
import { createSqlite3Persister } from "tinybase/persisters/persister-sqlite3"
import { readFile } from "node:fs/promises"
import { string } from "zod"
import sqlite3 from "sqlite3"

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
      filePath: { type: "string" },
      fileContent: { type: "string" },
      topicName: { type: "string" },
      topicContent: { type: "string" },
      // notes: { type: "" }, // array of ids of 'notes'
      // links: { type: "" }, // array of ids of 'links'
    },
    notes: {
      content: { type: "string" },
      url: { type: "string" },
      public: { type: "boolean" },
    },
    links: {
      title: { type: "string" },
      url: { type: "string" },
      public: { type: "boolean" },
    },
  })
  // TODO: add sqlite persistence
  const db = new sqlite3.Database(":memory:")
  // TODO: not sure where to get createSqlite3Persister from
  // https://tinybase.org/api/persister-sqlite3/functions/creation/createsqlite3persister/
  const persister = createSqlite3Persister(store, db, "learn-anything")
  await persister.save()
  return store
}
