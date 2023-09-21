import { onMount } from "solid-js"
import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { MobiusType } from "../root"

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
export function createGlobalState(mobius: MobiusType) {
  const [state, setState] = createStore<GlobalState>({
    globalTopicsSearchList: [],
  })

  // TODO: load it from tinybase if it's there
  onMount(async () => {
    const res = await mobius.query({
      publicGetGlobalTopics: {
        prettyName: true,
        name: true,
      },
    })
    // @ts-ignore
    setState({ globalTopicsSearchList: res.data.publicGetGlobalTopics })
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
