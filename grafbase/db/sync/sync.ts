import { client } from "../client"
import { addUser, getUserIdByName, getUsers } from "../user"
import { forceWikiSync } from "./wiki"

async function main() {
  // resetDb()
  // seed()
  // getUsers()
  // getTopics()
  // const userId = await getUserIdByName("Nikita")
  // if (userId.length > 0) {
  //   // @ts-ignore
  //   forceWikiSync(userId[0])
  // }
  getUserIdByName("Nikita")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

// async function seed() {
//   addUser({ name: "Nikita", email: "nikita@learn-anything.xyz" })
// }

async function clearTable(table: "User" | "Topic" | "Note" | "Link") {
  const res = await client.query(
    `
    delete $table;
  `,
    {
      table,
    }
  )
  console.log(res)
}

async function resetDb() {
  await clearTable("Topic")
  await clearTable("User")
  await clearTable("Note")
  await clearTable("Link")
  // await seed()
}
