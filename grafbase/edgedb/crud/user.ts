import { client } from "../client"
import e from "../dbschema/edgeql-js"

export interface User {
  email: string
  hankoId: string
  name?: string
}

export async function updateUserMemberUntilDate(hankoId: string, date: Date) {
  const res = await e
    .update(e.User, (user) => ({
      filter_single: { hankoId: hankoId },
      set: {
        memberUntil: date,
      },
    }))
    .run(client)

  console.log(res)
}

export async function addUser(user: User) {
  const res = await e
    .insert(e.User, {
      email: user.email,
      hankoId: user.hankoId,
    })
    .run(client)
  console.log(res, "user added")
  return res?.id
}

export async function deleteUser(id: string) {
  const res = await e
    .delete(e.User, (user) => ({
      filter: e.op(user.id, "=", id),
    }))
    .run(client)
  return res
}

export async function getUsers() {
  const res = await e
    .select(e.User, () => ({
      name: true,
      email: true,
      id: true,
    }))
    .run(client)
  return res
}

export async function getUserIdByName(name: string) {
  const res = await e
    .select(e.User, (user) => ({
      id: true,
      filter: e.op(user.name, "ilike", name),
    }))
    .run(client)
  if (res.length === 0) {
    return undefined
  } else {
    return res[0].id
  }
}

export async function updateLearningStatusForGlobalTopic(
  email: string,
  topicName: string,
  learningStatus: "learning" | "learned" | "to learn",
) {
  if (learningStatus === "learning") {
    const res = await e.update(e.User, (user) => {
      return {
        filter_single: { email },
        set: {
          topicsLearning: {
            "+=": e.select(e.GlobalTopic, (gt) => {
              return {
                filter_single: { name: topicName },
              }
            }),
          },
        },
      }
    })
    return res.run(client)
  }
}
