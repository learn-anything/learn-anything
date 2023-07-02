import { client } from "../client"
import { addUser, getUserIdByName, getUsers } from "../user"
import { forceWikiSync } from "./wiki"
import e from "../dbschema/edgeql-js"
import { getTopic, getTopicCount, getTopics } from "../topic"

async function main() {
  // await resetDb()
  // seed()
  const userId = await getUserIdByName("Nikita")
  await forceWikiSync(userId)
  // await getUsers()
  // await getTopics()
  // await getTopic("Physics", userId)
  // await getTopicCount(userId)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

async function seed() {
  addUser({ name: "Nikita", email: "nikita@learn-anything.xyz" })
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
