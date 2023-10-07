import { splitUrlByProtocol } from "../../lib/util"
import {
  addGlobalLink,
  getAllGlobalLinksForTopic,
  removeTrailingSlashFromGlobalLinks,
} from "../crud/global-link"
import { getGlobalTopic } from "../crud/global-topic"
import {
  Topic,
  findFilePath,
  markdownFilePaths,
  parseMdFile,
} from "../sync/markdown"

async function main() {
  // await getMarkdownPaths()
  // const topic = await getTopic("3d-printing")
  // console.log("done")
  // const links = await getAllGlobalLinksForTopic("3d-printing")
  // console.log(links, "links")
  const topic = await getGlobalTopic("3d-printing")
  console.log(topic, "topic")
}

await main()

async function getMarkdownPaths(title: string) {
  const paths = await markdownFilePaths(process.env.wikiFolderPath!, [])
  console.log(paths[0])
  const filePath = paths[0]!
  const topic = await parseMdFile(filePath)
  // console.log(topic, "topic")
}

async function getTopic(topicName: string) {
  const filePath = await findFilePath(
    process.env.wikiFolderPath!,
    topicName + ".md",
  )
  if (filePath) {
    const topic = await parseMdFile(filePath)
    await processLinks(topic)
  }
}

async function processLinks(topic: Topic) {
  topic.links.map(async (link) => {
    await addGlobalLink(
      link.url,
      link.title,
      link.year,
      link.description,
      topic.name,
    )
  })
}

// TODO: move it away after release, is here as reference in trying to get all the topics ported for release
async function oneOffActions() {
  // await removeTrailingSlashFromGlobalLinks()
  // console.log("done")
  // const links = await updateAllGlobalLinksToHaveRightUrl()
  // console.log(links, "links")
  // console.log("done")
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
  // // console.log(topic.name)
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
