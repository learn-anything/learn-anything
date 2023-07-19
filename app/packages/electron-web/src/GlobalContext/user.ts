import { createContext, onMount, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { getSettings, getTopic } from "#preload"

export function createUserState() {
  const [user, setUser] = createStore({
    showEditorSettings: false,
    wikiPath: "",
    topicContent: "",
    topicName: "SQLite",
  })

  onMount(async () => {
    const settings = await getSettings()
    const topic = await getTopic("sqlite")
    setUser({ topicContent: topic.fileContent, wikiPath: settings.wikiPath })
  })

  return {
    // state
    user,
    // actions
    setShowEditorSettings: (state: boolean) => {
      return setUser({ showEditorSettings: state })
    },
    setWikiPath: (state: string) => {
      console.log(state, "wiki path")
      return setUser({ wikiPath: state })
    },
  } as const
}

const UserCtx = createContext<ReturnType<typeof createUserState>>()

export const UserProvider = UserCtx.Provider

export const useUser = () => {
  const ctx = useContext(UserCtx)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
