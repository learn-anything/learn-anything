import { onMount } from "solid-js"
import { createContext, useContext } from "solid-js"
import { MobiusType } from "../root"
import { createStore } from "solid-js/store"
import { TablesSchema, createStore as tinybaseCreateStore } from "tinybase"
import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db"

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
  // onMount(async () => {
  //   const res = await mobius.query({
  //     publicGetGlobalTopics: {
  //       prettyName: true,
  //       name: true,
  //     },
  //   })
  //   console.log(res, "res")
  //   // @ts-ignore
  //   setState({ globalTopicsSearchList: res.data.publicGetGlobalTopics })
  // })

  onMount(async () => {
    const tableSchema: TablesSchema = {
      globalLinks: {
        title: { type: "string" },
        url: { type: "string" },
        id: { type: "string" },
      },
    }

    const store = tinybaseCreateStore()
    store.setTablesSchema(tableSchema)

    // create indexed db persister
    const persister = createIndexedDbPersister(store, "global")
    // load from existing store if it exists
    await persister.load()

    const globalLinks = store.getTable("globalLinks")
    // check if global links are empty in store
    if (Object.keys(globalLinks).length === 0) {
      const links = await mobius.query({
        getGlobalLinks: {
          id: true,
          url: true,
          title: true,
        },
      })

      links.data.getGlobalLinks.map((link) => {
        store.addRow("globalLinks", {
          title: link.title,
          url: link.url,
          id: link.id,
        })
      })
      console.log("saved")
      await persister.save()
    }

    console.log(globalLinks, "global links")
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
