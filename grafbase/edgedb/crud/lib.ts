import e from "../dbschema/edgeql-js"

export function foundUserByHankoId(hankoId: string) {
  return e.select(e.User, (user) => ({
    filter_single: e.op(user.hankoId, "=", hankoId)
  }))
}

// for queries that use above function to find user, this is what is expected on mutation queries
// If the user is missing: []
// If the user is a member and cancellation date is in the future: [{ id }]
// If the user is a cancelled/lapsed member but has some free actions: [{ id }]
// If the user is not a member but has some free actions: [{ id }]
// If the user is not a member or is lapsed and has no free actions: throws error
