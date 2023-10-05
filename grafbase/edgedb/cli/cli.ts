import {
  addGlobalLink,
  updateAllGlobalLinksToHaveRightUrl,
} from "../crud/global-link"
import { parseMdFile } from "../sync/markdown"
import { markdownFilePaths } from "../sync/wiki"

async function main() {
  const links = await updateAllGlobalLinksToHaveRightUrl()
  console.log(links, "links")
  console.log("done")
  return
  // console.log("done")
  // const link = await getGlobalLink()
  // console.log(link)
  // const links = await getAllGlobalLinks()
  // console.log(links, "links")
  // await removeDuplicateUrls()
  // await attachGlobalLinkToGlobalTopic(
  //   "https://www.mikeash.com/getting_answers.html",
  //   "asking-questions",
  // )
  const paths = await markdownFilePaths(process.env.wikiFolderPath!, [])
  // console.log(paths[0])
  const filePath = paths[0]!
  const topic = await parseMdFile(filePath)
  // console.log(topic.name)
  topic.links.map(async (link) => {
    // console.log(link.url, "url")
    // console.log(link.title, "title")
    // console.log(link.description, "desc")
    // console.log(link.year, "year")
    await addGlobalLink(link.url, link.title, link.year, link.description)
  })
  // await createGlobalTopicWithGlobalGuide(topic.name, topic.prettyName, "")
  // const links = await getAllGlobalLinks()
  // console.log(links, "links")
  // await updateTopicLearningStatus(
  //   process.env.LOCAL_USER_HANKO_ID!,
  //   "3d-printing",
  //   "learning",
  // )
  // let today = new Date()
  // let nextMonth = today.getMonth() + 1
  // let nextYear = today.getFullYear()
  // let nextMonthDate = new Date(nextYear, nextMonth, today.getDate())
  // await updateUserMemberUntilDate(
  //   process.env.LOCAL_USER_HANKO_ID!,
  //   nextMonthDate,
  // )
}

await main()
