import sqlite from "sqlite3"
import { createStore } from "tinybase/cjs"
import { createSqlite3Persister } from "tinybase/cjs/persisters/persister-sqlite3"

// creates tinybase store
// in-memory javascript store persisted to sqlite
// https://tinybase.org
export function setupTinybaseStore(options: { persist: boolean }) {
  // define the schema
  const store = createStore().setTablesSchema({
    wiki: {
      wikiFolderPath: { type: "string" }, // path to wiki folder connected to the wiki
      openTopic: { type: "string" }, // topicName of open topic
      // sidebarTopics: { type: "string" }, // TODO: JSON.stringify of SidebarTopic[] or better derive
    },
    topics: {
      topicName: { type: "string" }, // unique
      filePath: { type: "string" },
      fileContent: { type: "string" },
      topicContent: { type: "string" }, // markdown content of topic
      prettyName: { type: "string" },
      // parentTopic: { type: "string" }, // topicId of parent topic
    },
    notes: {
      topicId: { type: "string" }, // topic this note is attached to
      note: { type: "string" },
      url: { type: "string" },
      public: { type: "boolean" },
    },
    subnotes: {
      noteId: { type: "string" }, // note this subnote is attached to
      subnote: { type: "string" },
      order: { type: "number" },
    },
    links: {
      topicId: { type: "string" }, // topic this link is attached to
      title: { type: "string" },
      url: { type: "string" },
      public: { type: "boolean" },
      description: { type: "string" },
      relatedLinks: { type: "string" },
    },
    relatedLinks: {
      linkId: { type: "string" }, // topic this note is attached to
      title: { type: "string" },
      url: { type: "string" },
    },
  })
  if (options.persist) {
    const db = new sqlite.Database("learn-anything")
    // sets what tables get saved in sqlite
    const persister = createSqlite3Persister(store, db, {
      mode: "tabular",
      tables: {
        load: {
          wiki: "wiki",
          topics: "topics",
          notes: "notes",
          links: "links",
          relatedLinks: "relatedLinks",
        },
        save: {
          wiki: "wiki",
          topics: "topics",
          notes: "notes",
          links: "links",
          relatedLinks: "relatedLinks",
        },
      },
    })
    return persister
  }
  return store
}
