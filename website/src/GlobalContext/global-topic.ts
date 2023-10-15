import { createContext, createEffect, createMemo, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { MobiusType } from "../root"
import { useLocation } from "solid-start"
import { SearchResult } from "../components/Search"

export type GlobalLink = {
  id: string
  title: string
  url: string
  protocol: string
  description?: string
  year?: string | null
  liked?: boolean
  completed?: boolean
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
  name: string
  prettyName: string
  topicSummary: string
  topicPath: string
  latestGlobalGuide: LatestGlobalGuide
  links: GlobalLink[]
  learningStatus: "to_learn" | "learning" | "learned" | ""
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
    name: "",
    prettyName: "",
    topicPath: "",
    topicSummary: "",
    latestGlobalGuide: {
      summary: "",
      sections: []
    },
    links: [],
    learningStatus: ""
  })

  const currentTopicGlobalLinksSearch = createMemo(() => {
    return globalTopic.links.map(
      (link): SearchResult => ({
        name: link.title
      })
    )
  })

  // TODO: do grafbase queries to get user learning status
  // check that user is authed, can use import { signedIn } from "../../../lib/auth" for this
  const location = useLocation()
  createEffect(async () => {
    if (!location.pathname || location.pathname === "/") return

    const topicName = extractTopicFromPath(location.pathname)
    if (!topicName) return

    const topic = await mobius.query({
      publicGetGlobalTopic: {
        where: { topicName: topicName },
        select: {
          name: true,
          prettyName: true,
          topicSummary: true,
          topicPath: true,
          links: {
            id: true,
            title: true,
            url: true,
            year: true,
            protocol: true,
            description: true
          },
          latestGlobalGuide: {
            sections: {
              title: true,
              summary: true,
              links: {
                id: true,
                title: true,
                url: true,
                year: true,
                protocol: true,
                description: true
              }
            }
          }
        }
      }
    })

    // @ts-ignore
    const topicData = topic.data.publicGetGlobalTopic
    setGlobalTopic({
      name: topicData.name,
      prettyName: topicData.prettyName,
      topicSummary: topicData.topicSummary,
      topicPath: topicData.topicPath,
      latestGlobalGuide: topicData.latestGlobalGuide,
      links: topicData.links
    })
    // console.log(unwrap(globalTopic), "global topic")
  })

  return {
    globalTopic,
    set: setGlobalTopic,

    currentTopicGlobalLinksSearch
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
