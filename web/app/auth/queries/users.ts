import db from "db"

export default async function getUsers() {
  const users = await db.user.findMany()

  return users
}
