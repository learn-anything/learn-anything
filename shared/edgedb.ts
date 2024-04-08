import { client } from "../api/edgedb/client"
import e from "../api/edgedb/dbschema/edgeql-js"

export function foundUserByEmail(email: string) {
  return e.select(e.User, (user) => ({
    filter_single: e.op(user.email, "=", email)
  }))
}

// returns id of `Other` object
// it should be enforced that there is only one `Other` object in db, query relies on it to work
// TODO: https://discord.com/channels/841451783728529451/1226854877431599175
export async function foundOtherObjectId() {
  const res = await e.select(e.Other).run(client)
  return res[0]!.id
}

// for queries that use above function to find user, this is what is expected on mutation queries
// If the user is missing: []
// If the user is a member and cancellation date is in the future: [{ id }]
// If the user is a cancelled/lapsed member but has some free actions: [{ id }]
// If the user is not a member but has some free actions: [{ id }]
// If the user is not a member or is lapsed and has no free actions: throws error
