import { checkForGlobalLink, getAllGlobalLinks } from "../crud/global-link"

async function main() {
  // await checkForGlobalLink("https://www.edgedb.com/blog/edgedb-1-0")
  await getAllGlobalLinks()
}

await main()
