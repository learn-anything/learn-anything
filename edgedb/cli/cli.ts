import { checkForGlobalLink } from "../crud/global-link"

async function main() {
  await checkForGlobalLink("https://www.edgedb.com/blog/edgedb-1-0")
}

await main()
