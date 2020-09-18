import { SessionContext } from "blitz"

export default async function logout(_ = null, ctx: { session?: SessionContext } = {}) {
  return await ctx.session!.revoke()
}
