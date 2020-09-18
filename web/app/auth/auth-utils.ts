import { AuthenticationError } from "blitz"
import SecurePassword from "secure-password"
import db, { User } from "db"

const SP = new SecurePassword()

export const hashPassword = async (password: string) => {
  const hashedBuffer = await SP.hash(Buffer.from(password))
  return hashedBuffer.toString("base64")
}
export const verifyPassword = async (hashedPassword: string, password: string) => {
  return await SP.verify(Buffer.from(password), Buffer.from(hashedPassword, "base64"))
}

export const authenticateUser = async (email: string, password: string) => {
  const user = await db.user.findOne({ where: { email } })

  if (!user || !user.hashedPassword) throw new AuthenticationError()

  switch (await verifyPassword(user.hashedPassword, password)) {
    case SecurePassword.VALID:
      break
    case SecurePassword.VALID_NEEDS_REHASH:
      // Upgrade hashed password with a more secure hash
      const improvedHash = await hashPassword(password)
      await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
      break
    default:
      throw new AuthenticationError()
  }

  delete user.hashedPassword
  return user as Omit<User, "hashedPassword">
}
