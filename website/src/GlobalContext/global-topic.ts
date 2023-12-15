import { createContext, createEffect, createMemo, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { useLocation } from "solid-start"
import { SearchResult } from "@la/shared/ui"
import { MobiusType } from "../root"
import { getHankoCookie, parseResponse } from "@la/shared/lib"
import { log } from "../lib/baselime"

export type GlobalLink = {
  id: string
  title: string
  url: string
  protocol: string
  description: string | null
  year?: string | null
  liked?: boolean
  completed?: boolean
}
export type Section = {
  title: string
  summary: string | null
  links: GlobalLink[]
}
type LatestGlobalGuide = {
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
  verifiedTopic: boolean
  // linksBookmarkedIds: string[]
  // linksInProgressIds: string[]
  // linksCompletedIds: string[]
  // linksLikedIds: string[]
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
      sections: []
    },
    links: [],
    notes: [{ content: "test" }],
    learningStatus: "",
    // linksBookmarkedIds: [],
    // linksInProgressIds: [],
    // linksCompletedIds: [],
    // linksLikedIds: [],
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
      const [data] = parseResponse(topic)
      if (data) {
        setGlobalTopic({
          prettyName: data.publicGetGlobalTopic.prettyName,
          topicSummary: data.publicGetGlobalTopic.topicSummary,
          latestGlobalGuide: data.publicGetGlobalTopic.latestGlobalGuide,
          links: data.publicGetGlobalTopic.links,
          notesCount: data.publicGetGlobalTopic.notesCount
        })
      }
    }
  })

  const location = useLocation()
  createEffect(async () => {
    // only run effect on /topic pages
    const topicName = extractTopicFromPath(location.pathname)
    if (!topicName) return
    // TODO: not scaleable, fix it
    if (
      topicName === "profile" ||
      topicName === "pricing" ||
      topicName === "desktop-login" ||
      topicName === "get-api-key" ||
      topicName.startsWith("@")
    )
      return
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
            learningStatus: true
            // linksBookmarkedIds: true,
            // linksInProgressIds: true,
            // linksCompletedIds: true,
            // linksLikedIds: true
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
      const [data] = parseResponse(res)
      if (data) {
        // TODO: no idea why it thinks `linksBookmarkedIds` returns {}[]..
        setGlobalTopic({
          // @ts-ignore
          learningStatus: data.getGlobalTopic.learningStatus, // TODO: should fix grafbase return type
          // // @ts-ignore
          // linksBookmarkedIds: data.getGlobalTopic.linksBookmarkedIds,
          // // @ts-ignore
          // linksInProgressIds: data.getGlobalTopic.linksInProgressIds,
          // // @ts-ignore
          // linksCompletedIds: data.getGlobalTopic.linksCompletedIds,
          // // @ts-ignore
          // linksLikedIds: data.getGlobalTopic.linksLikedIds,
          // @ts-ignore
          notes: data.getNotesForGlobalTopic
        })
      }
      return
      // @ts-ignore
      // const topicData = res.data.getGlobalTopic
      // @ts-ignore
      // const notesData = res.data.getNotesForGlobalTopic
      // setGlobalTopic({
      //   learningStatus: topicData.learningStatus,
      //   linksBookmarkedIds: topicData.linksBookmarkedIds,
      //   linksInProgressIds: topicData.linksInProgressIds,
      //   linksCompletedIds: topicData.linksCompletedIds,
      //   linksLikedIds: topicData.linksLikedIds,
      //   notes: notesData
      // })
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
