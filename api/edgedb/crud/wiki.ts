import { client } from "../client"
import e from "../dbschema/edgeql-js"

// Create wiki linked to user
export async function addWiki(userId: string) {
  const res = await e
    .insert(e.Wiki, {
      user: e.select(e.User, () => ({
        filter_single: { id: userId },
      })),
    })
    .run(client)
  return res
}

// Given userId, return wikiId if exists
export async function getWikiIdByUserId(userId: string) {
  const res = await e
    .select(e.Wiki, (wiki) => ({
      id: true,
      filter: e.op(wiki.user.id, "=", e.cast(e.uuid, userId)),
    }))
    .run(client)
  if (res.length === 0) {
    return undefined
  } else {
    return res[0].id
  }
}
