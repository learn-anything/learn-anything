import { client } from "../client"
import { addUser, getUserIdByName, getUsers } from "../user"
import { forceWikiSync, writeToFile } from "./wiki"
import e from "../dbschema/edgeql-js"
import { getSidebar, getTopic, getTopicCount, getTopics } from "../topic"
import mri from "mri"
import dotenv from "dotenv"

dotenv.config()

async function main() {
  // await resetDb()
  const userId = await getUserIdByName(process.env.USERNAME!)
  await forceWikiSync(userId)
  // const count = await getTopicCount(userId)
  // console.log(count)
  // const sidebar = await getSidebar(userId)
  // await writeToFile(
  //   "/Users/nikiv/Desktop/sidebar.json",
  //   JSON.stringify(sidebar)
  // )
  // console.log(sidebar)
  // console.log(sidebar)
  // await getUsers()
  // const topics = await getTopics()
  // await getTopic("physics", userId)
  // await getTopicCount(userId)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

async function seed() {
  return addUser({ name: "Nikita", email: "nikita@learn-anything.xyz" })
}

async function clearTable(table: any) {
  const res = await e.delete(table).run(client)
  console.log(res)
  return res
}

async function resetDb() {
  await clearTable(e.Note)
  await clearTable(e.Link)
  await clearTable(e.Topic)
  await clearTable(e.User)
  await seed()
}
