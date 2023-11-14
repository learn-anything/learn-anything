import { client } from "../client"
import e from "../dbschema/edgeql-js"

export async function addPersonalWiki(hankoId: string) {
  const res = await e
    .insert(e.PersonalWiki, {
      user: e.select(e.User, () => ({
        filter_single: { hankoId: hankoId }
      }))
    })
    .run(client)
  return res
}

export async function addFileAsTopic(
  hankoId: string,
  fileContent: string,
  topicName: string,
  prettyName: string,
  published: boolean
) {
  const foundWiki = e.assert_single(
    e.assert_exists(
      e.select(e.PersonalWiki, (pw) => ({
        filter: e.op(pw.user.hankoId, "=", hankoId)
      }))
    )
  )

  await e
    .insert(e.Topic, {
      wiki: foundWiki,
      name: topicName,
      prettyName: prettyName,
      content: fileContent,
      public: true
    })
    .run(client)

  // await e
  //   .insert(e.Topic, {
  //     wiki: e.select(e.PersonalWiki, (pw) => ({
  //       filter: e.op(pw.user.hankoId, "=", hankoId)
  //     })),
  //     name: topicName,
  //     content: fileContent
  //   })
  //   .run(client)
}

// Given userId, return wikiId if exists
export async function getWikiIdByUserId(userId: string) {
  const res = await e
    .select(e.PersonalWiki, (wiki) => ({
      id: true,
      filter: e.op(wiki.user.id, "=", e.cast(e.uuid, userId))
    }))
    .run(client)
  if (res.length === 0) {
    return undefined
  } else {
    // @ts-ignore
    return res[0].id
  }
}
