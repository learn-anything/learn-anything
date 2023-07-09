/**
 * @module preload
 */

export { sha256sum } from "./nodeCrypto"
export { versions } from "./versions"
import { readFile } from "node:fs/promises"
// import { store } from "../../main/src/index"
import { defineStore } from "electron-nano-store"
import { contextBridge } from "electron"

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
