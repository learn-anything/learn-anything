import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"

interface Section {
  title: string
  summary?: string
  ordered: boolean
  links?: Link[]
}

interface Link {
  title: string
  url: string
  author?: string
  year?: number
  completed?: boolean
  addedByUser?: boolean
}

interface EditGuide {
  guideSummary: string
  guideSections: Section[]
  editingSection?: number // id of section being edited
}

// global state of wiki
export default function createEditGuideState() {
  const [editedTopic, setEditedTopic] = createStore<EditGuide>({
    guideSummary:
      "Physics is the study of matter, energy, and the fundamental forces that drive the natural phenomena of the universe.",
    guideSections: [
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
  })

  return {
    // state
    editedTopic,
    // actions
    setEditingSection(id: number) {
      // setEditedTopic(...editedTopic, { editingSection: id })
    },
  }
}

const EditGuideCtx = createContext<ReturnType<typeof createEditGuideState>>()

export const EditGuideProvider = EditGuideCtx.Provider

export const useEditGuide = () => {
  const ctx = useContext(EditGuideCtx)
  if (!ctx) throw new Error("useEditGuide must be used within UserProvider")
  return ctx
}
