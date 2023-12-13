import { eventListener } from "@solid-primitives/event-listener"
import { invoke } from "@tauri-apps/api/tauri"
import { createContext, createEffect, onMount, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { create, insert, search } from "@orama/orama"

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
  theme: "light" | "dark"
  vim: boolean
  oramaDb: any
  mode:
    | "Default"
    | "SearchFilesModal"
    | "LogInInstructions"
    | "Settings"
    | "SearchTopics"

  // monaco: Monaco | null,
  // editor: monacoEditor.IStandaloneCodeEditor | null
}

export function createGlobalState() {
  const [state, setState] = createStore<GlobalState>({
    localFolderPath: localStorage.getItem("localFolderPath") || "",
    files: [],
    showModal: "",
    showBox: false,
    theme: "light",
    vim: false,
    mode: "Default",
    oramaDb: {},

    // monaco: null,
    // editor: null
  })

  // onMount(async () => {
  //   const db = await create({
  //     schema: {
  //       fileContent: "",
  //       filePath: ""
  //     }
  //   })

  //   await insert(db, {
  //     fileContent: "hi",
  //     filePath: "gtge"
  //   })

  // })

  createEffect(async () => {
    if (state.files.length > 0) {
    }
  })

  onMount(() => {
    const handleColorSchemeChange = (matches: any) => {
      if (matches) {
        setState({ theme: "dark" })
      } else {
        setState({ theme: "light" })
      }
    }
    handleColorSchemeChange(window.matchMedia("(prefers-color-scheme: dark)"))
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleColorSchemeChange)
  })
  onMount(async () => {
    const localFolderPath = state.localFolderPath
    if (!localFolderPath) return

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
    setVim: (boolean: boolean) => {
      setState({ vim: boolean })
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
