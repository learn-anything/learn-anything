import { grafbaseTypeDefs } from "@la/shared/lib"
import fs from "fs"
import path from "path"
import Mobius from "graphql-mobius"

export function mobius() {
  return new Mobius<typeof grafbaseTypeDefs>({
    fetch: (query) =>
      fetch(process.env.GRAFBASE_API_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer`
        },
        body: JSON.stringify({
          query,
          variables: {}
        })
      }).then((res) => res.json())
  })
}

export function getMarkdownFiles(dirPath: string) {
  let mdFiles = <string[]>[]
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file)
    if (fs.statSync(fullPath).isDirectory()) {
      mdFiles = mdFiles.concat(getMarkdownFiles(fullPath))
    } else if (path.extname(fullPath) === ".md") {
      mdFiles.push(fullPath)
    }
  })
  return mdFiles
}
