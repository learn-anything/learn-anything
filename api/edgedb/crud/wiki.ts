import { client } from "../client"
import e from "../dbschema/edgeql-js"

export async function getWikiIdByUserId(userId: string) {
  const res = await e
    .select(e.Wiki, (wiki) => ({
      id: true,
      filter: e.op(user.id, "ilike", userId),
    }))
    .run(client)
  if (res.length === 0) {
    return undefined
  } else {
    return res[0].id
  }
}
