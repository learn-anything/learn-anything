import { getGlobalTopicPublic } from "../../../edgedb/crud/global-topic"

export default async function getGlobalTopic(
  root: any,
  args: { topicName: string },
  context: any,
) {
  const topic = await getGlobalTopicPublic("3d-printing")
  return topic

  // const globalTopic = {
  //   prettyTopicName: "Physics",
  //   userLearningStatus: "learning",
  //   globalGuideSummary:
  //     "Physics is the study of matter, energy, and the fundamental forces that drive the natural phenomena of the universe.",
  //   globalGuideSections: [
  //     {
  //       title: "Intro",
  //       ordered: true,
  //       links: [
  //         {
  //           title: "So You Want to Learn Physics…",
  //           url: "https://www.susanrigetti.com/physics",
  //           year: 2021,
  //         },
  //       ],
  //     },
  //   ],
  // }
  // return globalTopic
}
