import { describe, it } from "vitest"
import { setupTinybaseStore } from "~/packages/preload/src/tinybase/tinybase"

describe("parses", () => {
  it("test folder", (t) => {
    const testFolderPath = getTestFolderPath()
    const tinybase = setupTinybaseStore()

    tinybase.getStore().addRow("wiki", {
      wikiFolderPath: testFolderPath,
    })

    // const fileContent = (await readFile(filePath)).toString()
    // const tree = fromMarkdown(fileContent)
  })

  // it("Nikita wiki", (t) => {
  //   //   const wikiFolderPath = getWikiFolderPath("nikita")
  //   //   const filePaths = await markdownFilePaths(wikiFolderPath)
  //   //   const filePath = filePaths[0]
  //   //   const fileContent = (await readFile(filePath)).toString()
  //   //   const tree = fromMarkdown(fileContent)
  //   //   for (const node of tree.children) {
  //   //     console.log(toString(node), "node")
  //   //   }
  //   //   // TODO: does not save to sqlite when run with bun at least
  //   //   tinybase.getStore().addRow("wiki", {
  //   //     wikiFolderPath: wikiFolderPath,
  //   //   })
  // })
})

function parseMarkdownFile(filePath: string) {
  console.log(filePath, "file path")
}

function getWikiFolderPath(folderName: string) {
  let fileDirectoryPath = __dirname
  return fileDirectoryPath.replace("/app/tests", `/seed/wiki/${folderName}`)
}

function getTestFolderPath() {
  let fileDirectoryPath = __dirname
  return fileDirectoryPath.replace("/app/tests", "/seed/test")
}
