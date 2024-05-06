import e, { $infer } from "../dbschema/edgeql-js"

// export const indexAuth = e.params(
//   { userId: e.optional(e.uuid) },
//   ({ userId }) => {
//     const user = e.op(
//       e.cast(e.User, userId),
//       "if",
//       e.op("exists", userId),
//       "else",
//       e.global.current_user,
//     )
//     return e.select(user, () => ({
//       name: true,
//       bio: true,
//       place: true,
//       displayName: true,
//       profilePhotoUrl: true,
//       createdPosts: {
//         photoUrl: true,
//         description: true,
//       },
//     }))
//   },
// )
// export type profileAuthReturn = $infer<typeof indexAuth>

// TODO: change, just for testing
export const indexPublic = e.select(e.User, (u) => ({
	email: true,
}))
export type profilePublicReturn = $infer<typeof indexPublic>
