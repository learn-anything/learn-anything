import { createContext, useContext } from "solid-js"
import { MobiusType } from "../root"
import { createStore } from "solid-js/store"

type PersonalTopicStore = {
  name: string
  content: string
  prettyName: string
  public: boolean
  topicPath: string
}

// state needed to render:
// learn-anything.xyz/@user/<topic>
export default function createPersonalTopic(mobius: MobiusType) {
  const [topic, setTopic] = createStore<PersonalTopicStore>({
    name: "",
    prettyName: "",
    content: "",
    public: false,
    topicPath: ""
  })

  return {
    topic,
    set: setTopic
  }
}

const PersonalTopicCtx = createContext<ReturnType<typeof createPersonalTopic>>()

export const PersonalTopicProvider = PersonalTopicCtx.Provider

export const useTopic = () => {
  const ctx = useContext(PersonalTopicCtx)
  if (!ctx) throw new Error("usePersonalTopic must be used within UserProvider")
  return ctx
}
