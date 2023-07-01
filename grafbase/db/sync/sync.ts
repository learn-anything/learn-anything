import { client } from "../client"
import { addUser, getUserIdByName, getUsers } from "../user"
import { forceWikiSync } from "./wiki"
import e from "../dbschema/edgeql-js"
import { getTopicCount, getTopics } from "../topic"

async function main() {
  // resetDb()
  // getUsers()
  // getTopics()
  const userId = await getUserIdByName("Nikita")
  if (userId.length > 0) {
    forceWikiSync(userId[0].id)
    getTopicCount(userId[0].id)
  }
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
