import { createContext, onMount, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { MobiusType } from "../root"

type PersonalTopicStore = {
  name: string
  content: string
  prettyName: string
  topicPath: string
}

// state needed to render:
// learn-anything.xyz/@user/<topic>
export default function createPersonalTopic(mobius: MobiusType) {
  const [topic, setTopic] = createStore<PersonalTopicStore>({
    name: "",
    prettyName: "",
    content: "",
    topicPath: ""
  })

  onMount(async () => {
    const res = await mobius.query({
      publicGetPersonalTopic: {
        where: {
          topicName: "asking-questions",
          user: "nikiv"
        },
        // TODO: not sure why `select: true` was failing..
        select: {
          prettyName: true,
          content: true,
          topicPath: true
        }
      }
    })
    // @ts-ignore
    const topic = res?.data.publicGetPersonalTopic[0]
    if (topic) {
      setTopic("content", topic.content)
      setTopic("prettyName", topic.prettyName)
      setTopic("topicPath", topic.topicPath)
    }
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
