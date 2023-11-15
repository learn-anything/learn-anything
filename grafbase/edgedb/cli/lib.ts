import { grafbaseTypeDefs } from "@la/shared/lib"
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

// async function getMarkdownPaths() {
//   const paths = await markdownFilePaths(process.env.wikiFolderPath!, [])
//   return paths
//   // console.log(paths[0])
//   // const filePath = paths[0]!
//   // const topic = await parseMdFile(filePath)
//   // console.log(topic, "topic")
// }

// async function markdownFilePaths(dirPath, filePaths=[]) {
//   const entries = fs.readdirSync(dirPath, { withFileTypes: true });

//   for (const entry of entries) {
//     const res = path.resolve(dirPath, entry.name);
//     if (entry.isDirectory()) {
//       filePaths = await markdownFilePaths(res, filePaths);
//     } else if (entry.isFile() && path.extname(entry.name) === '.md') {
//       filePaths.push(res);
//     }
//   }
//   return filePaths;
// }
