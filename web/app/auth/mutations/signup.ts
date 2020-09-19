import db from "db"
import { SessionContext } from "blitz"
import { hashPassword } from "app/auth/auth-utils"
import { SignupInput, SignupInputType } from "app/auth/validations"

export default async function signup(
  input: SignupInputType,
  ctx: { session?: SessionContext } = {}
) {
  // This throws an error if input is invalid
  const { email, password, username } = SignupInput.parse(input)

  const hashedPassword = await hashPassword(password)
  const user = await db.user.create({
    data: { email, hashedPassword, username, role: "user" },
    select: { id: true, username: true, email: true, role: true },
  })

  await ctx.session!.create({ userId: user.id, roles: [user.role] })

  return user
}
