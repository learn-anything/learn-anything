async function main() {
  const hankoId = process.env.LOCAL_USER_HANKO_ID!
  // console.log(process.env.wikiFolderPath)
  // await saveFileAsTopic()

  // TODO:
  // go over all the files in wiki folder, and upload to wiki
  // one button to publish, then mark as public, each one

  // const res = await addFileAsTopic(
  //   hankoId,
  //   "physics",
  //   "Physics",
  //   true,
  //   "physics is great"
  // )
  // console.log(res, "res")
  // const res = await editTopic(
  //   hankoId,
  //   "physics",
  //   "Physics",
  //   true,
  //   "Physics is great"
  // )
  // console.log(res)
  // const res = await updateGlobalLinkStatus(
  //   hankoId,
  //   "d88b5d34-6da7-11ee-bab3-bb6a7f9c90a9",
  //   "uncomplete"
  // )
  // console.log(res)
}

async function saveFileAsTopic(filePath: string, localFolderPath: string) {
  const parts = filePath.split("/")
  // TODO: not sure how to avoid ts-ignore nicely here
  // @ts-ignore
  const fileName = parts[parts.length - 1]
  // @ts-ignore
  const topicName = fileName.split(".")[0]
  const prettyName =
    // @ts-ignore
    topicName.charAt(0).toUpperCase() +
    // @ts-ignore
    topicName.slice(1).replace(/-/g, " ")
  let relativePath = ""
  if (filePath && localFolderPath) {
    relativePath = filePath.replace(localFolderPath, "")
  }
  console.log(topicName)
  console.log(prettyName)
  // TODO: give ui to set it to true or false
  // for now set to true as no E2E yet or mobile
  const published = true
  // console.log(
  //   global.state.currentlyOpenFile?.fileContent,
  //   "content",
  // )
  // console.log(relativePath)

  // const content =
  //   global.state.currentlyOpenFile?.fileContent!

  // doing this as edgedb when taking a string with new lines
  // save it strangely without `\n`, hard to see where new lines are this way
  // this solves this, probably better way to do this
  // const cleanContent = content.replace(/\n/g, "<br>")
  // console.log(cleanContent, "clean")

  // const res = await mobius().mutate({
  //   updateTopicOfWiki: {
  //     where: {
  //       topicName: topicName!,
  //       prettyName: prettyName,
  //       published: published,
  //       content: cleanContent,
  //       topicPath: relativePath,
  //     },
  //     select: true,
  //   },
  // })
  // console.log(res, "res")
}

await main()
console.log("done")
