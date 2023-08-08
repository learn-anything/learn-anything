import path from "path"
import { fileURLToPath } from "url"

export function getTestFolderPath() {
  const __filename = fileURLToPath(import.meta.url)
  const fileDirectoryPath = path.dirname(__filename)
  return fileDirectoryPath.replace("/lib/test", "/seed/wiki/test")
}

export function getSeedFolderPath(seedFolder: string) {
  const __filename = fileURLToPath(import.meta.url)
  const fileDirectoryPath = path.dirname(__filename)
  return fileDirectoryPath.replace("/lib/test", `/seed/wiki/${seedFolder}`)
}

function getWikiFolderPath(folderName: string) {
  const __filename = fileURLToPath(import.meta.url)
  const fileDirectoryPath = path.dirname(__filename)
  return fileDirectoryPath.replace("/test", `/seed/wiki/${folderName}`)
}

// TODO: not doing tests on tinybase currently, but would be nice
// to check that some tinybase integration work well with sqlite
// export function deleteSqliteDbFromCurrentFolder() {
//   const __filename = fileURLToPath(import.meta.url)
//   const fileDirectoryPath = path.dirname(__filename)
//   console.log(fileDirectoryPath, "path")
//   // return fileDirectoryPath.replace("/test", "/learn-anything")
//   // const path = getSqliteDbPath()
//   // fs.unlinkSync(path)
// }
