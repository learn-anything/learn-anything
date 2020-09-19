import { SessionContext } from "blitz"
import db from "db"

export default async function addLink(
  { url, title }: { url: string; title: string },
  ctx: { session?: SessionContext } = {}
) {
  const link = await db.link.create({
    data: {
      title,
      url,
      user: { connect: { id: ctx.session!.userId } },
    },
  })
  return link
}
