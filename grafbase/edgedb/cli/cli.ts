import { getAllGlobalLinks } from "../crud/global-link"

async function main() {
  const links = await getAllGlobalLinks()
  console.log(links, "links")
}

await main()
