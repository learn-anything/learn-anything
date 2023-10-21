import { jwtVerify, createRemoteJWKSet } from "jose"
import { GraphQLError } from "graphql"
import { Context } from "@grafbase/sdk"

// validates that the token in `authorization` header is correct
// if it is valid, returns hanko id of the user
export async function hankoIdFromToken(context: Context) {
  // when run locally, don't validate the token, return local admin user hanko id
  // if (process.env.LOCAL_USE) {
  //   return process.env.LOCAL_USER_HANKO_ID
  // }
  const authHeader = context.request.headers["Authorization"]
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new GraphQLError("Missing or invalid Authorization header")
  }
  const JWKS = createRemoteJWKSet(
    new URL(`${process.env.PUBLIC_HANKO_API_URL}/.well-known/jwks.json`)
  )
  const hankoToken = authHeader.split(" ")[1]
  try {
    const verifiedJWT = await jwtVerify(hankoToken ?? "", JWKS)
    const hankoId = verifiedJWT.payload.sub
    return hankoId
  } catch (err) {
    throw new GraphQLError("Verification failed")
  }
}
