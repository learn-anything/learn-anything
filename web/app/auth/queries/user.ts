import db from "db"

export default async function getUser(username: string) {
  const user = await db.user.findOne({
    where: { username },
    select: { id: true, username: true, email: true, role: true },
  })

  return user
}
