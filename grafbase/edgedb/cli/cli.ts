import { removeProtocolFromUrlOfGlobalLinks } from "../crud/global-link"
import { publicGetGlobalTopics } from "../crud/global-topic"

async function main() {
  // await removeProtocolFromUrlOfGlobalLinks()
  // await checkForGlobalLink("https://www.edgedb.com/blog/edgedb-1-0")
  // await getAllGlobalLinks()
  // console.log(await publicGetGlobalTopics())
  const topics = await publicGetGlobalTopics()
  console.log(topics, "topics")
}

await main()
