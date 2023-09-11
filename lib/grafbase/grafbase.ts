import { jwtVerify, createRemoteJWKSet } from "jose"
import { GraphQLError } from 'graphql'

// validates that the token in `authorization` header is correct
// if it is valid, returns email of the user (passed in as separate header)
export async function validUserEmailFromToken(context: any) {
  // when run locally, don't validate the token, return local user email
  if (process.env.LOCAL_USE) {
    return process.env.LOCAL_USER_EMAIL
  }
  const authHeader = context.request.headers["authorization"]
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new GraphQLError("Missing or invalid Authorization header")
  }
  const JWKS = createRemoteJWKSet(
    new URL(`${process.env.PUBLIC_HANKO_API_URL}/.well-known/jwks.json`),
  )
  const hankoToken = authHeader.split(" ")[1]
  const verifiedJWT = await jwtVerify(hankoToken ?? "", JWKS)

  if (!verifiedJWT) {
    throw new GraphQLError("Verification failed")
  }
  const email = context.request.headers["email"]
  return email
}
