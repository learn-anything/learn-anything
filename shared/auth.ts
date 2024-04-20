import { default as Cookies } from "js-cookie"
import { jwtVerify, createRemoteJWKSet } from "jose"
import { GraphQLError } from "graphql"
import { Context } from "@grafbase/sdk"

// validates that the token in `authorization` header is correct
// if it is valid, returns email of user
// otherwise it throws with GraphQLError (to be used inside grafbase resolvers)
export async function emailFromHankoToken(context: Context) {
	if (process.env.GRAFBASE_ENV === "dev") {
		return process.env.EMAIL!
	}

	const authHeader = context.request.headers["authorization"]
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new GraphQLError("Missing or invalid Authorization header")
	}

	const hankoToken = authHeader.split(" ")[1]
	if (!hankoToken) {
		throw new GraphQLError("Missing token in Authorization header")
	}

	try {
		const JWKS = createRemoteJWKSet(
			new URL(`${process.env.PUBLIC_HANKO_API_URL}/.well-known/jwks.json`),
		)

		const verifiedJWT = await jwtVerify(hankoToken, JWKS)

		const email = verifiedJWT.payload.email as string
		if (!email) {
			throw new GraphQLError("Email not found in token payload")
		}

		// Check if the token is expired
		const expirationTime = verifiedJWT.payload.exp
		if (expirationTime && expirationTime < Math.floor(Date.now() / 1000)) {
			throw new GraphQLError("Token expired")
		}

		return email
	} catch (err) {
		console.error("Token verification failed:", err)
		throw new GraphQLError("Token verification failed")
	}
}

export function getHankoCookie(): string {
	const hankoCookie = Cookies.get("hanko")
	return hankoCookie ?? ""
}

// TODO: should probably also check validity of token?
// right now it just checks that token exists but it can be expired
export function signedIn() {
	const hankoCookie = Cookies.get("hanko")
	return !!hankoCookie
}

// TODO: ideally I should not be calling this code manually
// it should be done as part of gql clients
// be called when you make a gql request that is not some public resolver
// would also be nice if I didn't have to pass navigate in but it seems I am forced to
export function isSignedIn(navigate: (path: string) => void) {
	if (!getHankoCookie()) {
		localStorage.setItem("pageBeforeSignIn", location.pathname)
		navigate("/auth")
		return false
	}
	return true
}
