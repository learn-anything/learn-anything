import { getGlobalTopicDetails } from "../crud/global-topic"

async function main() {
  const hankoId = process.env.LOCAL_USER_HANKO_ID!
  const res = await getGlobalTopicDetails("physics", hankoId)
  console.log(res)
  // console.log(await foundUserByHankoId(hankoId))
  // await testEdgeDbJs()
  // const res = await updateTopicLearningStatus(hankoId, "physics", "learning")
  // console.log(res, "res")
  // console.log(res)
  // console.log(hankoId, "id")
  // const res = await getUserDetails(hankoId)
  // console.log(res)
  // console.log(foundUserIsMember(hankoId).toEdgeQL())
  // const res = await updateTopicLearningStatus(hankoId, "physics", "none")
  // console.log(res, "res")
  // return
  // const files = getMarkdownFiles(process.env.wikiFolderPath!)
  // console.log(files)
  // return
  // const testString = `# Asking Questions<br><br>[This](http://www.catb.org/esr/faqs/smart-questions.html) has everything in it on how to ask questions correctly.<br><br>In short, it can be summed down to this:<br><br>1. Do your own research first.<br>2. Include things you have tried and thought of before asking the question.<br>3. Be explicit about what you want to achieve in the end and provide as much information as possible to help.<br>4. Respect other people's time.<br><br>[XY problem](http://xyproblem.info) is also something to be aware of. When asking for help, let the people know what the problem you are trying to solve actually is instead of simply saying your solution and the reader guessing what it is you are actually trying to do.<br><br>`
  // const html = await markdownToHtml(testString)
  // console.log(html, "html")
}

async function testEdgeDbJs() {}

// TODO: used for wiki publishing, make it work
// async function saveFileAsTopic(filePath: string, localFolderPath: string) {
//   const parts = filePath.split("/")
//   // TODO: not sure how to avoid ts-ignore nicely here
//   // @ts-ignore
//   const fileName = parts[parts.length - 1]
//   // @ts-ignore
//   const topicName = fileName.split(".")[0]
//   const prettyName =
//     // @ts-ignore
//     topicName.charAt(0).toUpperCase() +
//     // @ts-ignore
//     topicName.slice(1).replace(/-/g, " ")
//   let relativePath = ""
//   if (filePath && localFolderPath) {
//     relativePath = filePath.replace(localFolderPath, "")
//   }
//   console.log(topicName)
//   console.log(prettyName)
//   // TODO: give ui to set it to true or false
//   // for now set to true as no E2E yet or mobile
//   const published = true
//   // console.log(
//   //   global.state.currentlyOpenFile?.fileContent,
//   //   "content",
//   // )
//   // console.log(relativePath)

//   // const content =
//   //   global.state.currentlyOpenFile?.fileContent!

//   // doing this as edgedb when taking a string with new lines
//   // save it strangely without `\n`, hard to see where new lines are this way
//   // this solves this, probably better way to do this
//   // const cleanContent = content.replace(/\n/g, "<br>")
//   // console.log(cleanContent, "clean")

//   // const res = await mobius().mutate({
//   //   updateTopicOfWiki: {
//   //     where: {
//   //       topicName: topicName!,
//   //       prettyName: prettyName,
//   //       published: published,
//   //       content: cleanContent,
//   //       topicPath: relativePath,
//   //     },
//   //     select: true,
//   //   },
//   // })
//   // console.log(res, "res")
// }

await main()
console.log("done")
