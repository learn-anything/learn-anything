import { createContext, createEffect, createMemo, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { useLocation } from "solid-start"
import { SearchResult } from "@la/shared/ui"
import { MobiusType } from "../root"
import { getHankoCookie } from "../../lib/auth"
import { log } from "../lib/baselime"

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
type GlobalNote = {
  content: string
  url?: string
}
export type GlobalTopic = {
  name: string
  prettyName: string
  topicSummary: string
  topicPath: string
  latestGlobalGuide: LatestGlobalGuide
  links: GlobalLink[]
  notes: GlobalNote[]
  notesCount?: number
  // description?: string
  // topicWebsiteLink?: string
  // wikipediaLink?: string
  // githubLink?: string
  // xLink?: string
  // redditLink?: string
  // aiSummary?: string
  learningStatus: "to_learn" | "learning" | "learned" | ""
  likedLinkIds: string[]
  completedLinkIds: string[]
  verifiedTopic: boolean
}

export function extractTopicFromPath(inputStr: string) {
  const segments = inputStr
    .split("/")
    .filter((segment: string) => segment.trim() !== "")
  return segments.length > 0 ? segments[0] : null
}

// state for rendering global topic found in learn-anything.xyz/<topic>
export default function createGlobalTopic(
  mobius: MobiusType,
  user: any,
  global: any
) {
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
    notes: [{ content: "test" }],
    learningStatus: "",
    likedLinkIds: [],
    completedLinkIds: [],
    verifiedTopic: false
  })

  const currentTopicGlobalLinksSearch = createMemo(() => {
    return globalTopic.links.map(
      (link): SearchResult => ({
        name: link.title
      })
    )
  })

  createEffect(() => {
    if (global.state.topicsWithConnections.length > 0) {
      const topicName = extractTopicFromPath(location.pathname)
      // @ts-ignore
      const foundTopic = global.state.topicsWithConnections.some(
        (i: any) => i.name === topicName
      )
      setGlobalTopic("verifiedTopic", Boolean(foundTopic))
    }
  })

  createEffect(async () => {
    // only run effect on /topic pages
    const topicName = extractTopicFromPath(location.pathname)
    if (!topicName) return

    if (globalTopic.verifiedTopic && location.pathname !== "/profile") {
      const topic = await mobius.query({
        publicGetGlobalTopic: {
          where: { topicName: topicName },
          select: {
            prettyName: true,
            topicSummary: true,
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
            },
            links: {
              id: true,
              title: true,
              url: true,
              year: true,
              protocol: true,
              description: true
            },
            notesCount: true
          }
        }
      })

      // @ts-ignore
      const topicData = topic.data.publicGetGlobalTopic
      // @ts-ignore
      setGlobalTopic({
        prettyName: topicData.prettyName,
        topicSummary: topicData.topicSummary,
        latestGlobalGuide: topicData.latestGlobalGuide,
        links: topicData.links,
        notesCount: topicData.notesCount
      })
    }
  })

  const location = useLocation()
  createEffect(async () => {
    // only run effect on /topic pages
    const topicName = extractTopicFromPath(location.pathname)
    if (!topicName) return
    if (topicName === "profile" || topicName === "pricing") return
    setGlobalTopic("name", location.pathname.slice(1))

    let verifiedTopic = false
    const topicsAndConnections = localStorage.getItem("topicsAndConnections")
    if (topicsAndConnections) {
      const foundTopic = JSON.parse(topicsAndConnections).some(
        (i: any) => i.name === topicName
      )
      setGlobalTopic("verifiedTopic", Boolean(foundTopic))
      verifiedTopic = Boolean(foundTopic)
      if (!foundTopic) {
        log(`topic not found: ${location.pathname.slice(1)}`)
      }
    }

    if (!verifiedTopic) {
      setGlobalTopic({
        prettyName: "",
        topicSummary: "",
        latestGlobalGuide: {
          summary: "",
          sections: []
        },
        links: [],
        notesCount: 0
      })
    }

    if (getHankoCookie()) {
      const res = await mobius.query({
        getGlobalTopic: {
          where: {
            topicName: topicName
          },
          select: {
            learningStatus: true,
            likedLinkIds: true,
            completedLinkIds: true
          }
        },
        getNotesForGlobalTopic: {
          where: {
            topicName: topicName
          },
          select: {
            content: true,
            url: true
          }
        }
      })
      // @ts-ignore
      const topicData = res.data.getGlobalTopic
      // @ts-ignore
      const notesData = res.data.getNotesForGlobalTopic
      setGlobalTopic({
        learningStatus: topicData.learningStatus,
        likedLinkIds: topicData.likedLinkIds,
        completedLinkIds: topicData.completedLinkIds,
        notes: notesData
      })
    }
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
