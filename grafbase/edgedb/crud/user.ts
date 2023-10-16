import { client } from "../client"
import e from "../dbschema/edgeql-js"

export interface User {
  email: string
  hankoId: string
  name?: string
}

export async function getUserDetails(hankoId: string) {
  const user = await e
    .select(e.User, (u) => ({
      filter_single: e.op(u.hankoId, "=", hankoId),
      memberUntil: true
    }))
    .run(client)
  const currentDate = new Date()
  if (user?.memberUntil && user.memberUntil > currentDate) {
    return {
      isMember: true
    }
  } else {
    return {
      isMember: false
    }
  }
}

export async function updateUserMemberUntilDate(hankoId: string, date: Date) {
  const res = await e
    .update(e.User, (user) => ({
      filter_single: { hankoId: hankoId },
      set: {
        memberUntil: date
      }
    }))
    .run(client)

  console.log(res)
}

export async function createUser(email: string, hankoId: string) {
  console.log("trying to create user")
  const res = await e
    .insert(e.User, {
      email: email,
      hankoId: hankoId
    })
    .run(client)
  console.log(res, "res....")
  return res?.id
}

export async function deleteUser(id: string) {
  const res = await e
    .delete(e.User, (user) => ({
      filter: e.op(user.id, "=", id)
    }))
    .run(client)
  return res
}

export async function getUsers() {
  const res = await e
    .select(e.User, () => ({
      name: true,
      email: true,
      id: true
    }))
    .run(client)
  return res
}

export async function getUserIdByName(name: string) {
  const res = await e
    .select(e.User, (user) => ({
      id: true,
      filter: e.op(user.name, "ilike", name)
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
  learningStatus: "learning" | "learned" | "to learn"
) {
  if (learningStatus === "learning") {
    const res = await e.update(e.User, (user) => {
      return {
        filter_single: { email },
        set: {
          topicsLearning: {
            "+=": e.select(e.GlobalTopic, (gt) => {
              return {
                filter_single: { name: topicName }
              }
            })
          }
        }
      }
    })
    return res.run(client)
  }
}

export async function updateMemberUntilOfUser(
  email: string,
  memberUntilDateInUnixTime: number
) {
  const res = await e
    .update(e.User, () => ({
      filter_single: { email },
      set: { memberUntil: new Date(memberUntilDateInUnixTime * 1000) }
    }))
    .run(client)
  console.log(res, "res")
}
