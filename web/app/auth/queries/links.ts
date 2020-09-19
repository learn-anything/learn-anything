import db from "db"

export default async function getLinks(userId: number) {
  const links = await db.link.findMany({
    where: { user: { id: userId } },
    select: { id: true, title: true, url: true },
  })

  return links
}
