import { jwtVerify, createRemoteJWKSet } from "jose"

// used in grafbase resolvers to validate the token
export async function validHankoToken(context: any) {
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
  return true
}
