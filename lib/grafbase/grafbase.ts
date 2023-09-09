import { jwtVerify, createRemoteJWKSet } from "jose"

export async function userEmailFromHankoToken(context: any) {
  // validate as in local grafbase server
  if (process.env.LOCAL_USE) {
    return true
  }
  const authHeader = context.request.headers["authorization"]
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // return "Missing or invalid Authorization header"
    return false
  }
  const JWKS = createRemoteJWKSet(
    new URL(`${process.env.PUBLIC_HANKO_API_URL}/.well-known/jwks.json`),
  )
  const hankoToken = authHeader.split(" ")[1]
  const verifiedJWT = await jwtVerify(hankoToken ?? "", JWKS)

  if (!verifiedJWT) {
    // return "Verification failed"
    return false
  }
  return "nikita@nikiv.dev"
}
