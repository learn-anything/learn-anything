import { GraphQLError } from "graphql"
import { jwtVerify, createRemoteJWKSet } from "jose"

// validates that the token in `authorization` header is correct
// if it is valid, returns email of the user (passed in as separate header)
async function validUserEmailFromToken(context: any) {
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
  console.log(verifiedJWT, "verified JWT")
  console.log(JSON.stringify(verifiedJWT), "verified JWT")

  // const email = await fetch(`${process.env.PUBLIC_HANKO_API_URL}/users/`)

  // return email
  return "nikita@nikiv.dev"
  // process.env.PUBLIC_HANKO_API_URL
}


export default async function checkForGlobalLinkResolver(
  root: any,
  args: { email: string },
  context: any,
) {
  const email = await validUserEmailFromToken(context)
  console.log("ran?")
  if (email) {
    // TODO: mocking for now, update with real db call
    return {
      url: "https://learn-anything.xyz",
      title: "Learn Anything"
    }
  }
  throw new GraphQLError("Error")
}
