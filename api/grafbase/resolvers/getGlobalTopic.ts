import { createRemoteJWKSet, jwtVerify } from "jose"

export default async function getTopicResolver(
  root: any,
  args: { topicName: string },
  context: any,
) {
  try {
    const JWKS = createRemoteJWKSet(new URL(process.env.JWKS_URL!))

    const authHeader = request.headers["Authorization"]
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return "Missing or invalid Authorization header"
    }

    const token = authHeader.split(" ")[1]

    const { payload } = await jwtVerify(token, JWKS, {
      audience: process.env.AUDIENCE,
      issuer: process.env.ISSUER,
    })

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

    return "Verified. You got in."
  } catch (error) {
    return "Verification failed. You shall not pass."
  }
}
