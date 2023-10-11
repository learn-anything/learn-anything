import { createContext, createEffect, createMemo, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { MobiusType } from "../root"
import { useLocation } from "solid-start"
import { SearchResult } from "../components/Search"

type GlobalLink = {
  id: string
  title: string
  url: string
  year?: string | null
}
export type Section = {
  summary: string
  title: string
  links: GlobalLink[]
}
type LatestGlobalGuide = {
  summary: string
  sections: Section[]
}
export type GlobalTopic = {
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

// state for rendering global topic found in learn-anything.xyz/<topic>
export default function createGlobalTopic(mobius: MobiusType) {
  const [globalTopic, setGlobalTopic] = createStore<GlobalTopic>({
    prettyName: "",
    topicPath: "",
    topicSummary: "",
    latestGlobalGuide: {
      summary: "",
      sections: [],
    },
    links: [],
  })

  const currentTopicGlobalLinksSearch = createMemo(() => {
    if (!globalTopic.links) return []

    return globalTopic.links.map(
      (link): SearchResult => ({
        name: link.title,
      }),
    )
  })

  // TODO: do grafbase queries to get user learning status
  // check that user is authed, can use import { signedIn } from "../../../lib/auth" for this
  const location = useLocation()
  createEffect(async () => {
    if (location.pathname && !(location.pathname === "/")) {
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
        setGlobalTopic({
          prettyName: topicData.prettyName,
          topicSummary: topicData.topicSummary,
          topicPath: topicData.topicPath,
          latestGlobalGuide: topicData.latestGlobalGuide,
          links: topicData.links,
        })
        // console.log(unwrap(globalTopic), "global topic")
      }
    }
  })

  return {
    globalTopic,
    set: (state: GlobalTopic) => {
      setGlobalTopic(state)
    },

    currentTopicGlobalLinksSearch,
    // topicGlobalLinksSearch,
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
