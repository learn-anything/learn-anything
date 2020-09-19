import { SessionContext } from "blitz"
import db from "db"

export default async function addLink(
  { url, title }: { url: string; title: string },
  ctx: { session?: SessionContext } = {}
) {
  await db.link.create({
    data: {
      title,
      url,
      user: { connect: { id: ctx.session!.userId } },
    },
  })
}
