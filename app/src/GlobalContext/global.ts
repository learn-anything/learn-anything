import { createContext, createEffect, onMount, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { invoke } from "@tauri-apps/api/tauri"

export type File = {
  fileContent: string
  filePath: string
}

type GlobalState = {
  localFolderPath: string
  files: File[]
  currentlyOpenFile?: File
  showModal: "" | "needToLoginInstructions" | "searchFiles"
  showBox: boolean
}

export function createGlobalState() {
  const [state, setState] = createStore<GlobalState>({
    localFolderPath: "",
    files: [],
    showModal: "",
    showBox: false,
  })

  onMount(async () => {
    const localFolderPath = localStorage.getItem("localFolderPath")
    if (localFolderPath) {
      const connectedFolder = await invoke("connect_folder_with_path", {
        path: localFolderPath,
      })

      setState("localFolderPath", localFolderPath)
      if (connectedFolder !== null) {
        // @ts-ignore
        setState("localFolderPath", connectedFolder[0])
        // @ts-ignore
        setState("files", connectedFolder[1])
      }
    }
  })

  createEffect(() => {
    if (state.files.length > 0) {
      const openFile = localStorage.getItem("openFile")
      if (openFile) {
        setState(
          "currentlyOpenFile",
          state.files.find((file) => file.filePath === openFile),
        )
      }
    }
  })

  createEffect(() => {
    if (state.currentlyOpenFile) {
      localStorage.setItem("openFile", state.currentlyOpenFile.filePath)
    }
  })

  createEffect(() => {
    if (state.localFolderPath) {
      localStorage.setItem("localFolderPath", state.localFolderPath)
    }
  })

  return {
    state,
    set: setState,
    setShowBox: (boolean: boolean) => {
      setState({ showBox: boolean })
    },
  }
}

const GlobalStateCtx = createContext<ReturnType<typeof createGlobalState>>()

export const GlobalStateProvider = GlobalStateCtx.Provider

export const useGlobalState = () => {
  const ctx = useContext(GlobalStateCtx)
  if (!ctx) throw new Error("useGlobalState must be used within UserProvider")
  return ctx
}
