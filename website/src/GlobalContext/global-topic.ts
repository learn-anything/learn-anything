import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"

// example sections
// guideSections: [
//   {
//     title: "Intro",
//     ordered: true,
//     links: [
//       {
//         title: "So You Want to Learn Physics…",
//         url: "https://www.susanrigetti.com/physics",
//         year: 2021,
//       },
//     ],
//   },
// ],

type Section = {
  title: string
  summary?: string
  ordered: boolean
  links?: Link[]
}

type Link = {
  title: string
  url: string
  author?: string
  year?: number
  completed?: boolean
  addedByUser?: boolean
}

// TODO: add sections, do query to edgedb
type GlobalGuide = {
  summary: string
  sections?: Section[]
}

type GlobalTopic = {
  prettyName: string
  globalGuide: GlobalGuide
}

// all state needed to render global topic found in learn-anything.xyz/<topic>
export default function createGlobalTopic() {
  const [globalTopic, setGlobalTopic] = createStore<GlobalTopic>({
    prettyName: "",
    globalGuide: {
      summary: "",
    },
  })

  return {
    globalTopic,
    set: (state: GlobalTopic) => {
      setGlobalTopic(state)
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
