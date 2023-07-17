import { createContext, onMount, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { getTopic } from "#preload"

export function createUserState() {
  const [user, setUser] = createStore({
    showEditorSettings: false,
    wikiPath: "/Users/nikiv/src/app/learn-anything/seed/wiki/nikita",
    topicContent: "",
  })

  onMount(async () => {
    const res = await getTopic("sqlite")
    setUser({ topicContent: res.fileContent })
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
