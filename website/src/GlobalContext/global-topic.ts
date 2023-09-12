import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"

export type Section = {
  order: number
  title: string
  ordered: boolean
  links: Link[]
  summary?: string
}

export type Link = {
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
  sections: Section[]
}

type PageState = "Global Guide" | "Links" | "Notes" | "Edit Global Guide"

type LearningStatus = "to learn" | "learning" | "learned" | null

type GlobalTopic = {
  showPage: PageState
  prettyName: string
  globalGuide: GlobalGuide
  userLearningStatus: LearningStatus
}

// all state needed to render global topic found in learn-anything.xyz/<topic>
export default function createGlobalTopic() {
  const [globalTopic, setGlobalTopic] = createStore<GlobalTopic>({
    prettyName: "",
    globalGuide: {
      summary: "",
      sections: [],
    },
    showPage: "Edit Global Guide",
    userLearningStatus: null,
  })

  return {
    globalTopic,
    set: (state: GlobalTopic) => {
      setGlobalTopic(state)
    },
    setShowPage: (state: PageState) => {
      setGlobalTopic({ showPage: state })
    },
    // TODO: add effect that will send db query to update learning status of user
    setUserLearningStatus: (state: LearningStatus) => {
      setGlobalTopic({ userLearningStatus: state })
    },
    addSection: (state: Section) => {
      const newSections = [...globalTopic.globalGuide.sections, state]
      setGlobalTopic({
        ...globalTopic,
        globalGuide: {
          ...globalTopic.globalGuide,
          sections: newSections,
        },
      })
    },
    addLinkToSection: (sectionOrder: number, link: Link) => {
      // Find the index of the section to modify
      const sectionIndex = globalTopic.globalGuide.sections.findIndex(section => section.order === sectionOrder);

      // If the section is found
      if (sectionIndex !== -1) {
        // Copy the current sections
        const newSections = [...globalTopic.globalGuide.sections];

        // Copy the links array of the specific section and add the new link
        newSections[sectionIndex] = {
          ...newSections[sectionIndex],
          links: [...newSections[sectionIndex].links, link]
        };

        // Update the globalTopic state with the modified sections
        setGlobalTopic({
          ...globalTopic,
          globalGuide: {
            ...globalTopic.globalGuide,
            sections: newSections
          }
        });
      } else {
        console.error(`Section with order ${sectionOrder} not found.`);
      }
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
