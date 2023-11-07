import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"

type GlobalState = {
  localFolderPath: string
}

export function createGlobalState() {
  const [state, setState] = createStore<GlobalState>({
    localFolderPath: "",
  })

  return {
    state,
    set: setState,
  }
}

const GlobalStateCtx = createContext<ReturnType<typeof createGlobalState>>()

export const GlobalStateProvider = GlobalStateCtx.Provider

export const useGlobalState = () => {
  const ctx = useContext(GlobalStateCtx)
  if (!ctx) throw new Error("useGlobalState must be used within UserProvider")
  return ctx
}
