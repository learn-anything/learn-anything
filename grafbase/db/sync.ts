import { client } from "./client"
import { createTopic, getTopics } from "./topic"
import { createUser, getUsers } from "./user"

async function main() {
  // resetDb()
  getUsers()
  createTopic(
    { name: "Physics", content: "Physics is fun" },
    "4ac43a0c-169f-11ee-93a2-9bad7dd0cab0"
  )
  getTopics()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

async function seed() {
  createUser({ name: "Nikita", email: "nikita@learn-anything.xyz" })
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
