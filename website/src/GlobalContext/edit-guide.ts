import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"

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

type Guide = {
  summary: string
  sections: Section[]
}

// state that holds the edit state of guide
// learn-anything.xyz/<topic>/edit
// on save, it validates the guide and creates a guide merge request
// if admin makes an edit and validation passes, it directly updates latestGlobalGuide of topic
export default function createEditGuide() {
  const [guide, setGuide] = createStore<Guide>({
    summary: "",
    sections: [],
  })

  return {
    guide,
    set: (state: Guide) => {
      setGuide(state)
    }
  }
}

const EditGuideCtx = createContext<ReturnType<typeof createEditGuide>>()

export const EditGuideProvider = EditGuideCtx.Provider

export const useEditGuide = () => {
  const ctx = useContext(EditGuideCtx)
  if (!ctx) throw new Error("useEditGuide must be used within UserProvider")
  return ctx
}
