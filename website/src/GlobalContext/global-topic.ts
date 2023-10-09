import { createContext, createSignal, onMount, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { MobiusType } from "../root"
import { useLocation } from "solid-start"

// type PageState = "Global Guide" | "Links" | "Notes" | "Edit Global Guide"
// type LearningStatus = "to learn" | "learning" | "learned" | null
// export type Link = {
//   title: string
//   url: string
//   author?: string
//   year?: number
//   completed?: boolean
//   addedByUser?: boolean
// }

type GlobalLink = {
  id: string
  title: string
  url: string
  year?: string
}
export type Section = {
  title: string
  links: GlobalLink[]
  // order: number
  // ordered: boolean
  // summary?: string
}
type LatestGlobalGuide = {
  summary: string
  sections: Section[]
}
type GlobalTopic = {
  prettyName: string
  topicSummary?: string
  topicPath?: string
  latestGlobalGuide?: LatestGlobalGuide
  links?: GlobalLink[]
}

function extractTopicFromPath(inputStr: string) {
  const segments = inputStr
    .split("/")
    .filter((segment: string) => segment.trim() !== "")
  return segments.length > 0 ? segments[0] : null
}

// all state needed to render global topic found in learn-anything.xyz/<topic>
export default function createGlobalTopic(mobius: MobiusType) {
  const [globalTopic, setGlobalTopic] = createStore<GlobalTopic>({
    prettyName: "",
    topicSummary: "",
    topicPath: "",
    latestGlobalGuide: {
      summary: "",
      sections: [],
    },
  })

  const [globalTopicLinksSearchDb, setGlobalTopicLinksSearchDb] =
    createSignal<any>(undefined)

  onMount(async () => {
    const location = useLocation()
    // TODO: hacky, make it robust, nested ifs, no good either
    if (!(location.pathname === "/")) {
      const topicName = extractTopicFromPath(location.pathname)
      if (topicName) {
        const topic = await mobius.query({
          publicGetGlobalTopic: {
            where: { topicName: topicName },
            select: {
              prettyName: true,
              topicSummary: true,
              topicPath: true,
              links: {
                id: true,
                title: true,
                url: true,
                year: true,
              },
              latestGlobalGuide: {
                sections: {
                  title: true,
                  links: {
                    id: true,
                    title: true,
                    url: true,
                    year: true,
                  },
                },
              },
            },
          },
        })
        // @ts-ignore
        const topicData = topic.data.publicGetGlobalTopic
        console.log(topicData.links, "links!")
        setGlobalTopic({
          prettyName: topicData.prettyName,
          topicSummary: topicData.topicSummary,
          topicPath: topicData.topicPath,
          latestGlobalGuide: topicData.latestGlobalGuide,
          links: topicData.links,
        })
        console.log(globalTopic, "global topic")
      }
    }
  })

  return {
    globalTopic,
    set: (state: GlobalTopic) => {
      setGlobalTopic(state)
    },
    // setShowPage: (state: PageState) => {
    //   setGlobalTopic({ showPage: state })
    // },
    // TODO: use solid effect that listens on 'learning status' instead of below
    // setUserLearningStatus: async (state: LearningStatus) => {
    //   setGlobalTopic({ userLearningStatus: state })
    //   // await mobius.mutate()
    // },
  }
}

const GlobalTopicCtx = createContext<ReturnType<typeof createGlobalTopic>>()

export const GlobalTopicProvider = GlobalTopicCtx.Provider

export const useGlobalTopic = () => {
  const ctx = useContext(GlobalTopicCtx)
  if (!ctx) throw new Error("useGlobalTopic must be used within UserProvider")
  return ctx
}
