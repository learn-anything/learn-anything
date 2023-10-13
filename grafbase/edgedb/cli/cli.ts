import { addGlobalLink } from "../crud/global-link"
import { moveAllLinksOfGlobalTopicToSectionOther } from "../crud/global-topic"
import {
  Topic,
  findFilePath,
  markdownFilePaths,
  parseMdFile
} from "../sync/markdown"

async function main() {
  const paths = await getMarkdownPaths()
  const parts = paths[0]!.split("/")
  const fileName = parts[parts.length - 1] // Get the last part which is the filename
  const topicName = fileName!.split(".")[0]
  console.log(topicName)

  // const topic = await getTopicByFileName("3d-printing")
  // console.log(topic?.name)

  // const topic = {
  //   name: "3d-printing",
  //   prettyName: "3D Printing",
  //   topicSummary:
  //     "3D printing or additive manufacturing is the construction of a three-dimensional object from a CAD model or a digital 3D model.",
  //   sections: [
  //     {
  //       title: "Intro",
  //       summary: "Intro to 3D printing",
  //       linkIds: [],
  //     },
  //     {
  //       title: "Other",
  //       summary: "Other links",
  //       linkIds: [],
  //     },
  //   ],
  // } as GlobalTopic
  // await updateGlobalTopic(process.env.LOCAL_USER_HANKO_ID!, topic)

  // await processLinksFromMarkdownFilesAsGlobalLinks(topic?.name)
  await moveAllLinksOfGlobalTopicToSectionOther(topicName!)
  console.log("done")
}

await main()

async function getMarkdownPaths() {
  const paths = await markdownFilePaths(process.env.wikiFolderPath!, [])
  return paths
  // console.log(paths[0])
  // const filePath = paths[0]!
  // const topic = await parseMdFile(filePath)
  // console.log(topic, "topic")
}

async function getTopicByFileName(fileName: string) {
  const filePath = await findFilePath(
    process.env.wikiFolderPath!,
    fileName + ".md"
  )
  if (filePath) {
    const topic = await parseMdFile(filePath)
    return topic
  }
}

async function processLinksFromMarkdownFilesAsGlobalLinks(fileName: string) {
  const filePath = await findFilePath(
    process.env.wikiFolderPath!,
    fileName + ".md"
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
      topic.name
    )
  })
}

// TODO: move it away after release, is here as reference in trying to get all the topics ported for release
async function oneOffActions() {
  // await getMarkdownPaths()
  // const topic = await getTopic("3d-printing")
  // console.log("done")
  // const links = await getAllGlobalLinksForTopic("3d-printing")
  // console.log(links, "links")
  // const globalTopic = await getGlobalTopic("3d-printing")
  // console.log(globalTopic.links, "links")
  // console.log(globalTopic.prettyName, "pretty name")
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
