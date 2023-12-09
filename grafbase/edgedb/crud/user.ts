import { client } from "../client"
import e from "../dbschema/edgeql-js"
import { queryGetLearningStatus } from "../queries/queryGetLearningStatus.query"

export interface User {
  email: string
  hankoId: string
  name?: string
}

export async function getStripeSubscriptionObjectId(hankoId: string) {
  return await e
    .select(e.User, (u) => ({
      filter_single: e.op(u.hankoId, "=", hankoId),
      stripeSubscriptionObjectId: true
    }))
    .run(client)
}

export async function updateUserStoppedSubscription(hankoId: string) {
  await e
    .update(e.User, (u) => ({
      filter: e.op(u.hankoId, "=", hankoId),
      set: {
        subscriptionStopped: true
      }
    }))
    .run(client)

  return await e
    .select(e.User, (u) => ({
      filter_single: e.op(u.hankoId, "=", hankoId),
      stripeSubscriptionObjectId: true
    }))
    .run(client)
}

export async function updateUserRenewedSubscription(hankoId: string) {
  await e
    .update(e.User, (u) => ({
      filter: e.op(u.hankoId, "=", hankoId),
      set: {
        subscriptionStopped: false
      }
    }))
    .run(client)

  return await e
    .select(e.User, (u) => ({
      filter_single: e.op(u.hankoId, "=", hankoId),
      stripeSubscriptionObjectId: true
    }))
    .run(client)
}

export async function upgradeStripeMonthlyPlanToYear(hankoId: string) {
  const user = await e
    .select(e.User, (u) => ({
      filter_single: e.op(u.hankoId, "=", hankoId),
      stripeSubscriptionObjectId: true,
      memberUntil: true
    }))
    .run(client)

  // @ts-ignore
  const date = new Date(user?.memberUntil)
  date.setFullYear(date.getFullYear() + 1)
  const newDateString = date.toISOString()
  await e
    .update(e.User, (u) => ({
      filter_single: e.op(u.hankoId, "=", hankoId),
      set: {
        memberUntil: new Date(newDateString),
        stripePlan: "year"
      }
    }))
    .run(client)
}

export async function getPricingUserDetails(hankoId: string) {
  return await e
    .select(e.User, (u) => ({
      filter_single: e.op(u.hankoId, "=", hankoId),
      stripePlan: true,
      memberUntil: true,
      subscriptionStopped: true
    }))
    .run(client)
}

export async function getUserDetails(hankoId: string) {
  const user = await e
    .select(e.User, (u) => ({
      filter_single: e.op(u.hankoId, "=", hankoId),
      isMember: e.op(u.memberUntil, ">", e.datetime_current())
    }))
    .run(client)
  if (user?.isMember) {
    return { isMember: true }
  } else {
    return { isMember: false }
  }
}

export async function getLearningStatus(topicName: string, hankoId: string) {
  const res = await queryGetLearningStatus(client, {
    topicName: topicName,
    hankoId: hankoId
  })
  return res
}

export async function getAllLikedLinks(hankoId: string) {
  return await e
    .select(e.User, (user) => ({
      filter_single: e.all(
        e.set(
          e.op(user.hankoId, "=", hankoId),
          e.op("exists", user.memberUntil),
          e.op(user.memberUntil, ">", e.datetime_current())
        )
      ),
      likedLinks: {
        id: true,
        title: true,
        url: true,
        mainTopic: {
          name: true
        }
      },
      completedLinks: {
        id: true,
        title: true,
        url: true,
        mainTopic: {
          name: true
        }
      },
      personalLinks: {
        id: true,
        title: true,
        url: true,
        mainTopic: {
          name: true
        }
      }
    }))
    .run(client)
}

export async function getTopicsLearned(hankoId: string) {
  return await e
    .select(e.User, (user) => ({
      filter_single: e.op(user.hankoId, "=", hankoId),
      // filter_single: e.all(
      //   e.set(
      //     e.op(user.hankoId, "=", hankoId),
      //     e.op("exists", user.memberUntil),
      //     e.op(user.memberUntil, ">", e.datetime_current())
      //   )
      // ),
      topicsToLearn: {
        name: true,
        prettyName: true,
        verified: true
      },
      topicsLearning: {
        name: true,
        prettyName: true,
        verified: true
      },
      topicsLearned: {
        name: true,
        prettyName: true,
        verified: true
      }
    }))
    .run(client)
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
  const res = await e
    .insert(e.User, {
      email: email,
      hankoId: hankoId
    })
    .run(client)
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
    // @ts-ignore
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
  memberUntilDateInUnixTime: number,
  stripeSubscriptionObjectId: string,
  stripePlan: string
) {
  return await e
    .update(e.User, () => ({
      filter_single: { email },
      set: {
        memberUntil: new Date(memberUntilDateInUnixTime * 1000),
        stripeSubscriptionObjectId: stripeSubscriptionObjectId,
        stripePlan: stripePlan,
        subscriptionStopped: false
      }
    }))
    .run(client)
}

// https://discord.com/channels/841451783728529451/1176875453336780820
// not used currently as `freeActions` as non members just have some actions limited instead
// export async function getUserDetailsWithFreeActions(hankoId: string) {
//   const user = await e
//     .select(e.User, (u) => {
//       const isMember = e.op(
//         e.op(u.memberUntil, ">", e.datetime_current()),
//         "??",
//         e.bool(false)
//       )

//       return {
//         filter_single: e.op(u.hankoId, "=", hankoId),
//         freeActions: e.op(
//           e.cast(e.int16, e.set()),
//           "if",
//           isMember,
//           "else",
//           u.freeActions
//         )
//       }
//     })
//     .run(client)
//   const freeActions = user?.freeActions ?? null
//   return {
//     isMember: freeActions === null,
//     freeActions
//   }
// }
