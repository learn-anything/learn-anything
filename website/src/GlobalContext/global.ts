import { onMount } from "solid-js"
import { createContext, useContext } from "solid-js"
import { MobiusType } from "../root"
import { createStore } from "solid-js/store"
import { TablesSchema, createStore as tinybaseCreateStore } from "tinybase"
import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db"
import { create, search, insert } from "@orama/orama"

// TODO: persist everything to local storage with tinybase
// especially the globalTopicsSearchList so search is available instantly + offline

type GlobalTopicSearchItem = {
  name: string
  prettyName: string
}

type Link = {
  id: string
  url: string
  title: string
}

type GlobalState = {
  globalTopicsSearchList: GlobalTopicSearchItem[]
  globalLinks: []
  globalLinkSearch: any
}

// various global state
export function createGlobalState(mobius: MobiusType) {
  const [state, setState] = createStore<GlobalState>({
    globalTopicsSearchList: [],
    globalLinks: [],
    globalLinkSearch: undefined,
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
    // TODO: use tinybase .hasTable() instead
    if (Object.keys(globalLinks).length === 0) {
      const links = await mobius.query({
        getGlobalLinks: {
          id: true,
          url: true,
          title: true,
        },
      })

      if (links) {
        // @ts-ignore
        links.data.getGlobalLinks.map((link) => {
          store.addRow("globalLinks", {
            title: link.title,
            url: link.url,
            id: link.id,
          })
        })
        await persister.save()
      }
    }
    console.log(globalLinks, "global links")

    const db = await create({
      schema: {
        id: "string",
        title: "string",
        url: "string",
      },
    })

    // TODO: there should be a way to do this with tinybase API
    Object.keys(globalLinks).map(async (key) => {
      const link = globalLinks[key]
      console.log(link, "item")
      await insert(db, {
        id: link.id,
        url: link.url,
        title: link.title,
      })
    })

    const searchResult = await search(db, {
      title:
        "Collaborative Diffusion for Multi-Modal Face Generation and Editing",
    })

    console.log(searchResult.hits.map((hit) => hit.document))

    setState({ globalLinks: globalLinks })
  })

  return {
    state,
    setGlobalTopicsSearchList: (list: GlobalTopicSearchItem[]) => {
      setState({ globalTopicsSearchList: list })
    },
    searchGlobalLinksByTitle: async (title: string) => {
      console.log(state.globalLinks, "global links")
      console.log(title, "title")
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
