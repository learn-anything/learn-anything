import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"

interface Section {
  title: string
  summary?: string
  ordered: boolean
  links?: Link[]
}

interface Note {
  title: string
  url: string
}

interface Link {
  title: string
  url: string
  author?: string
  year?: number
  completed?: boolean
  addedByUser?: boolean
}

interface User {
  image: string
  username: string
}

export interface Topic {
  name: string
  status: "to learn" | "learning" | "learned" | null
  showPage: "Global Guide" | "Links" | "Notes" | "Edit Global Guide"
  guideSummary: string
  guideSections: Section[]
  links?: Link[]
  notes?: Note[]
  usersWantToLearn: User[]
  usersCurrentlyLearning: User[]
  usersHaveLearned: User[]
  moderators: User[]
  topicPath?: string
}

// global state of wiki
export default function createTopicState() {
  const [topic, setTopic] = createStore<Topic>({
    name: "Physics",
    status: null,
    showPage: "Global Guide",
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
    usersWantToLearn: [
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
    ],
    usersCurrentlyLearning: [
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
    ],
    usersHaveLearned: [
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
    ],
    moderators: [
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
      {
        image:
          "https://pbs.twimg.com/profile_images/1670708987816280065/KgCurTBh_400x400.jpg",
        username: "nikiv",
      },
    ],
  })

  return {
    // state
    topic,
    // actions
    setShowPage: (state: "Global Guide" | "Links" | "Notes") => {
      setTopic({ showPage: state })
    },
  }
}

const TopicCtx = createContext<ReturnType<typeof createTopicState>>()

export const TopicProvider = TopicCtx.Provider

export const useTopic = () => {
  const ctx = useContext(TopicCtx)
  if (!ctx) throw new Error("useTopic must be used within UserProvider")
  return ctx
}
