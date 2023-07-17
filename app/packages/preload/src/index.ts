/**
 * @module preload
 */

export { sha256sum } from "./nodeCrypto"
export { versions } from "./versions"
import { readFile } from "node:fs/promises"
import { defineStore } from "electron-nano-store"
import { contextBridge } from "electron"
import { createStore } from "tinybase"
import { createSqlite3Persister } from "tinybase/persisters/persister-sqlite3"
import sqlite3 from "sqlite3"

contextBridge.exposeInMainWorld("defineStore", defineStore)

// Everything exported from this file will be available in renderer as global function
// All NodeJS APIs are available in the preload process.

export async function getFileContent(path: string) {
  const store = await defineStore("user")
  const filePath = store.get("wikiFolderPath") + path
  return readFile(filePath, { encoding: "utf8" })
}

// path of folder where all wiki files are stored
export async function saveWikiFolderPath(path: string) {
  const store = await defineStore("user")
  // path needs it needs trailing / to work
  if (!path.endsWith("/")) {
    path += "/"
  }
  store.set("wikiFolderPath", path)
}

export async function getWikiFolderPath() {
  const store = await defineStore("user")
  return store.get("wikiFolderPath")
}

export async function getTopic(topic: string) {
  // const store = await defineStore("user")
  return {
    fileContent: `
    # [SQLite](https://www.sqlite.org/index.html)

    SQLite is great.
    `,
    topicName: "sqlite",
  }
}

export async function createTinyBaseStore() {
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
  const db = new sqlite3.Database("learn-anything")
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

// export async function createStore() {
//   const store = createStore()
// }

// export async function saveFile(filePath: string, topic: string) {
//   const store = createStore()

//   const file = readFile(filePath, { encoding: "utf8" })

//   store.setValue(topic, file)
// }
