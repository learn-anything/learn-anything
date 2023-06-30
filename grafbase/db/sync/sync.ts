import { client } from "../client"
import { addUser, getUsers } from "../user"
import { forceWikiSync } from "./wiki"

async function main() {
  // resetDb()
  // seed()
  // getUsers()
  // getTopics()
  forceWikiSync()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

async function seed() {
  addUser({ name: "Nikita", email: "nikita@learn-anything.xyz" })
}

async function clearTable(table: "User" | "Topic" | "Note" | "Link") {
  const res = await client.query(`
    delete User;
  `)
  console.log(res)
}

async function resetDb() {
  await clearTable("User")
  await clearTable("Topic")
  await clearTable("Note")
  await clearTable("Link")
  await seed()
}
