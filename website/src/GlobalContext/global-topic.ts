import { createContext, onMount, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { MobiusType } from "../root"
import { useLocation, useNavigate } from "solid-start"

export type Link = {
  title: string
  url: string
  author?: string
  year?: number
  completed?: boolean
  addedByUser?: boolean
}

export type Section = {
  order: number
  title: string
  ordered: boolean
  links: Link[]
  summary?: string
}

// TODO: add sections, do query to edgedb
type GlobalGuide = {
  summary: string
  sections: Section[]
}

type PageState = "Global Guide" | "Links" | "Notes" | "Edit Global Guide"

type LearningStatus = "to learn" | "learning" | "learned" | null

type GlobalTopic = {
  name: string
  showPage: PageState
  prettyName: string
  globalGuide: GlobalGuide
  userLearningStatus: LearningStatus
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
    name: "",
    prettyName: "",
    globalGuide: {
      summary: "",
      sections: [],
    },
    showPage: "Global Guide",
    userLearningStatus: null,
  })

  const location = useLocation()

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
        console.log(topic, "topic")
      }
    }
  })

  return {
    globalTopic,
    set: (state: GlobalTopic) => {
      setGlobalTopic(state)
    },
    setShowPage: (state: PageState) => {
      setGlobalTopic({ showPage: state })
    },
    // TODO: use solid effect that listens on 'learning status' instead of below
    setUserLearningStatus: async (state: LearningStatus) => {
      setGlobalTopic({ userLearningStatus: state })
      // await mobius.mutate()
    },
  }
}

const GlobalTopicCtx = createContext<ReturnType<typeof createGlobalTopic>>()

export const GlobalTopicProvider = GlobalTopicCtx.Provider

export const useGlobalTopic = () => {
  const ctx = useContext(GlobalTopicCtx)
  if (!ctx) throw new Error("useGlobalTopic must be used within UserProvider")
  return ctx
}
