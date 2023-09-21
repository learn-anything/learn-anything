import { onMount } from "solid-js"
import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { useMobius } from "../root"

// TODO: persist everything to local storage with tinybase
// especially the globalTopicsSearchList so search is available instantly + offline

type GlobalTopicSearchItem = {
  name: string
  prettyName: string
}

type GlobalState = {
  globalTopicsSearchList: GlobalTopicSearchItem[]
}

// various global state
export function createGlobalState() {
  const [state, setState] = createStore<GlobalState>({
    globalTopicsSearchList: [],
  })
  const mobius = useMobius()

  // TODO: load it from tinybase if it's there
  onMount(async () => {
    console.log(mobius)
    const res = await mobius.query({
      publicGetGlobalTopics: {
        prettyName: true,
        name: true,
      },
    })
    console.log(res, "res")
  })

  return {
    state,
    setGlobalTopicsSearchList: (list: GlobalTopicSearchItem[]) => {
      setState({ globalTopicsSearchList: list })
    },
  } as const
}

const GlobalStateCtx = createContext<ReturnType<typeof createGlobalState>>()

export const GlobalStateProvider = GlobalStateCtx.Provider

export const useGlobalState = () => {
  const ctx = useContext(GlobalStateCtx)
  if (!ctx) throw new Error("useGlobalState must be used within UserProvider")
  return ctx
}
