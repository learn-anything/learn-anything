import { client } from "../client"
import e from "../dbschema/edgeql-js"

export async function getPersonalTopic(userName: string, topicName: string) {
  const res = await e
    .select(e.Topic, (t) => ({
      filter: e.op(
        e.op(t.wiki.user.name, "=", userName),
        "and",
        e.op(t.name, "=", topicName)
      ),
      prettyName: true,
      content: true,
      public: true,
      topicPath: true
    }))
    .run(client)
  return res
}

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

// TODO: make it values are optional and only update the ones that are passed
export async function editTopic(
  hankoId: string,
  topicName: string,
  prettyName: string,
  published: boolean,
  fileContent: string,
  topicPath: string
) {
  const foundWiki = e.assert_single(
    e.assert_exists(
      e.select(e.PersonalWiki, (pw) => ({
        filter: e.op(pw.user.hankoId, "=", hankoId)
      }))
    )
  )

  return await e
    .update(e.Topic, (t) => ({
      filter_single: { wiki: foundWiki, name: topicName },
      set: {
        content: fileContent,
        prettyName: prettyName,
        public: published,
        topicPath: topicPath
      }
    }))
    .run(client)
}

export async function addFileAsTopic(
  hankoId: string,
  topicName: string,
  prettyName: string,
  published: boolean,
  fileContent: string
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
      // published
    })
    .run(client)
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
