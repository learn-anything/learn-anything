// TODO: cleanup code below, make into functions and move to shared/
// or move to local lib.ts folder in this same folder (if it's to be used only for prototyping here)

// it's currently here and all commented as it's quite messy
// some things are useful, some can be deleted forever
// async function moveLinksFromSectionsIncludingLinksToGuide(fileName: string) {
//   const filePath = await findFilePath(
//     process.env.wikiFolderPath!,
//     fileName + ".md"
//   )
//   if (filePath) {
//     const topic = await parseMdFile(filePath)
//     await processLinksBySection(topic)
//   }
// }

// async function processLinksBySection(topic: Topic) {
//   for (const link of topic.links) {
//     if (link.section) {
//       const [urlWithoutProtocol, protocol] = splitUrlByProtocol(link.url)
//       if (urlWithoutProtocol && protocol) {
//         // console.log(link.section, "link.section")
//         await addLinkToSectionOfGlobalTopic(
//           topic.name,
//           link.section,
//           urlWithoutProtocol
//         )
//       }
//     }
//   }
// }

// async function processLinksFromMarkdownFilesAsGlobalLinks(fileName: string) {
//   const filePath = await findFilePath(
//     process.env.wikiFolderPath!,
//     fileName + ".md"
//   )
//   if (filePath) {
//     const topic = await parseMdFile(filePath)
//     await processLinks(topic)
//   }
// }

// async function processLinks(topic: Topic) {
//   // console.log(topic.links, "links")
//   // return
//   topic.links.map(async (link) => {
//     await addGlobalLink(
//       link.url,
//       link.title,
//       link.year,
//       link.description,
//       topic.name
//     )
//   })
// }

// function toTitleCase(inputStr: string) {
//   // Split the string by hyphen and convert each segment to title case
//   const segments = inputStr
//     .split("-")
//     .map(
//       (segment) =>
//         segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
//     )

//   // Join the segments with a space
//   return segments.join(" ")
// }
// async function processNotesFromMarkdownFilesAsGlobalNotes(fileName: string) {
//   const filePath = await findFilePath(
//     process.env.wikiFolderPath!,
//     fileName + ".md"
//   )
//   if (filePath) {
//     const topic = await parseMdFile(filePath)
//     const notes = await justParseNotes(filePath)
//     for (const note of notes) {
//       await addGlobalNote(note.content, topic.name, note.url)
//     }
//   }
// }
// async function getTopicByFileName(fileName: string) {
//   const filePath = await findFilePath(
//     process.env.wikiFolderPath!,
//     fileName + ".md"
//   )
//   if (filePath) {
//     const topic = await parseMdFile(filePath)
//     return topic
//   }
// }
// TODO: move it away after release, is here as reference in trying to get all the topics ported for release
// async function oneOffActions() {
// const topic = "biases"
// return
// await addGlobalLink(
//   "https://blog.briansteffens.com/2017/02/20/from-math-to-machine.html",
//   "From math to machine: translating a function to machine code",
//   "2017",
//   "",
//   "fitness"
// )
// await addLinkToSectionOfGlobalTopic(
//   "programming-languages",
//   "Intro",
//   "blog.briansteffens.com/2017/02/20/from-math-to-machine.html"
// )
// console.log("added")
// return
// await changeGlobalTopicVerifiedstatus(topic, false)
// await deleteSectionsInGlobalTopic(topic)
// await moveLinksFromSectionsIncludingLinksToGuide(topic)
// console.log("done")
// return
// console.log("done")
// return
// console.log("done")
// return
// console.log("done")
// return
// const topicName = ""
// console.log("done")
// return
// return
// await deleteSectionsInGlobalTopic(topicName)
// await updateTitleOfGlobalLink(
//   "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
//   "Essense Of Linear Algebra"
// )
// const links = await removeTrailingSlashFromGlobalLinks()
// console.log(links, "links")
// const hankoId = process.env.LOCAL_USER_HANKO_ID!
// await updateGlobalTopic(hankoId!)
// const res = await getLearningStatus("neural-nets", hankoId)
// console.log(res)
// await updateUnverifiedTopicLearningStatus(hankoId, "", "none")
// await addPersonalLink("https://news.ycombinator.com", "Hacker News", hankoId!)
// await updateUnverifiedTopicLearningStatus(hankoId!, "reactivity", "to_learn")
// return
// clipboard.writeSync(JSON.stringify(someJson))
// const res = await getAllLikedLinks(hankoId!)
// console.log(res?.likedLinks)

// return
// const topics = await getAllTopicNames()
// const justNames = topics.map((t) => t.name)
// const topicObject = topics.reduce((obj, topic) => {
//   // @ts-ignore
//   obj[topic.name] = {
//     prettyName: topic.prettyName,
//     connections: []
//   }
//   return obj
// }, {})
// console.log(topicObject)
// clipboard.writeSync(JSON.stringify(topicObject))
// return
// const paths = await getMarkdownPaths()
// for (const path of paths) {
//   const topic = await parseMdFile(path)
//   const parts = path.split("/")
//   const fileName = parts[parts.length - 1] // Get the last part which is the filename
//   const topicName = fileName!.split(".")[0]
//   if (topicName) {
//     await setPrettyNameOfGlobalTopic(topicName, topic.prettyName)
//     // await processLinksFromMarkdownFilesAsGlobalLinks(topicName)
//     // const sections = await checkSectionsAreEmpty("design")
//     // if (sections.length === 0) {
//     //   await deleteSectionsInGlobalTopic(topicName)
//     //   await moveLinksFromSectionsIncludingLinksToGuide(topicName)
//     // }
//   }
// }
// const exists = await checkGlobalTopicExists(topicName!)
// if (exists.length > 0) {
//   console.log("topic exists")
//   continue
// }
// const prettyName = toTitleCase(topicName!)
// await createGlobalTopicWithGlobalGuide(topicName!, prettyName, "")
// await processLinksFromMarkdownFilesAsGlobalLinks(topicName!)
// await moveLinksFromSectionsToGuide(topicName!)
// await moveAllLinksOfGlobalTopicToSectionOther(topicName!)
// }
// const hankoId = process.env.LOCAL_USER_HANKO_ID!
// const res = await getTopicsLearned(hankoId)
// console.log(res, "res")
// const topicName = "edgedb"
// console.log("done")
// return
// await deleteSectionsInGlobalTopic(topicName)
// await processLinksFromMarkdownFilesAsGlobalLinks(topicName)
// await moveLinksFromSectionsIncludingLinksToGuide(topicName)
// const paths = await getMarkdownPaths()
// for (const path of paths) {
//   const parts = path.split("/")
//   const fileName = parts[parts.length - 1] // Get the last part which is the filename
//   const topicName = fileName!.split(".")[0]
//   console.log(topicName)
//   const exists = await checkGlobalTopicExists(topicName!)
//   if (exists.length > 0) {
//     console.log("topic exists")
//     continue
//   }
//   const prettyName = toTitleCase(topicName!)
//   await createGlobalTopicWithGlobalGuide(topicName!, prettyName, "")
//   await processLinksFromMarkdownFilesAsGlobalLinks(topicName!)
//   await moveLinksFromSectionsToGuide(topicName!)
//   await moveAllLinksOfGlobalTopicToSectionOther(topicName!)
//   console.log("done")
// }
// const topic = await getGlobalTopic(hankoId, "3d-printing")
// console.log(topic)
// await updatePrettyNameOfGlobalTopic("music-albums", "Music Albums")
// const hankoId = process.env.LOCAL_USER_HANKO_ID!
// const res = await getGlobalTopicQuery("guitar", hankoId)
// console.dir(res, { depth: null })
// await processLinksFromMarkdownFilesAsGlobalLinks(topicName!)
// const res = await getUserDetails(hankoId)
// console.log(res, "res")
// const res = await updateTopicLearningStatus(
//   hankoId,
//   "asking-questions",
//   "none"
// )
// const res = await updateGlobalLinkStatus(
//   hankoId,
//   "c29b845c-45ea-11ee-aedd-ffb76be6287b",
//   "uncomplete"
// )
// const res = await getGlobalTopic("asking-questions", hankoId)
// console.dir(res, { depth: null })
// console.log(res)
// const paths = await getMarkdownPaths()
// const parts = paths[0]!.split("/")
// const fileName = parts[parts.length - 1] // Get the last part which is the filename
// const topicName = fileName!.split(".")[0]
// console.log(topicName)
// const email = "nikita@nikiv.dev"
// const timestamp = 1923428131
// const iso8601_format = new Date(timestamp * 1000)
// console.log(iso8601_format)
// const res = await client.querySingle(
//   `
//   update User
//   filter .email = <str>$email
//   set {
//     memberUntil:= <datetime>$iso8601_format
//   }
// `,
//   { email, iso8601_format }
// )
// console.log(res, "res")
// const timestamp = 1684010131
// await updateMemberUntilOfUser(email, timestamp)
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
// TODO: complete moving notes
// await processNotesFromMarkdownFilesAsGlobalNotes("asking-questions")
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
// }
