import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"

export type File = {
  path: string
  content: string
}

type GlobalState = {
  localFolderPath: string
  files: File[]
  currentlyOpenFile?: File
}

export function createGlobalState() {
  const [state, setState] = createStore<GlobalState>({
    localFolderPath: "",
    files: [],
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
