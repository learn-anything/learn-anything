import { jwtVerify, createRemoteJWKSet } from "jose"

export default async function getTopicResolver(
  root: any,
  args: { topicName: string },
  context: any,
) {
  try {
    const authHeader = context.request.headers["Authorization"]
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return "Missing or invalid Authorization header"
    }

    const JWKS = createRemoteJWKSet(
      new URL(`${process.env.PUBLIC_HANKO_API_URL}/.well-known/jwks.json`),
    )

    const hankoToken = authHeader.split(" ")[1]
    const verifiedJWT = await jwtVerify(hankoToken ?? "", JWKS)
    if (!verifiedJWT) {
      return "Verification failed"
    }

    const globalTopic = {
      prettyTopicName: "Physics",
      userLearningStatus: "learning",
      globalGuideSummary:
        "Physics is the study of matter, energy, and the fundamental forces that drive the natural phenomena of the universe.",
      globalGuideSections: [
        {
          title: "Intro",
          ordered: true,
          links: [
            {
              title: "So You Want to Learn Physics…",
              url: "https://www.susanrigetti.com/physics",
              year: 2021,
            },
          ],
        },
      ],
    }
    return globalTopic
  } catch (error) {
    return "Verification failed"
  }
}
