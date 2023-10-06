import { createSignal, onMount } from "solid-js"
import { createContext, useContext } from "solid-js"
import { MobiusType } from "../root"
import { createStore } from "solid-js/store"
import {
  createQueries,
  createStore as tinybaseCreateStore,
} from "tinybase/with-schemas"
import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db/with-schemas"
import { create, search, insert } from "@orama/orama"
import { Links } from "solid-start/root"

type GlobalTopicSearchItem = {
  name: string
  prettyName: string
}

type GlobalLink = {
  id: string
  url: string
  title: string
}

type GlobalState = {
  globalTopicsSearchList: GlobalTopicSearchItem[]
  globalLinks: GlobalLink[]
  globalLinkSearchDb: any
}

// various global state
export function createGlobalState(mobius: MobiusType) {
  const [state, setState] = createStore<GlobalState>({
    globalTopicsSearchList: [],
    globalLinks: [],
    globalLinkSearchDb: undefined,
  })

  const [globalLinkSearchDb, setGlobalLinkSearchDb] =
    createSignal<any>(undefined)

  onMount(async () => {
    const topics = await mobius.query({
      publicGetGlobalTopics: {
        name: true,
        prettyName: true,
      },
    })
    if (topics) {
      // @ts-ignore
      setState({ globalTopicsSearchList: topics.data.publicGetGlobalTopics })
    }
  })

  onMount(async () => {
    const tableSchema = {
      globalLinks: {
        title: { type: "string" },
        url: { type: "string" },
        id: { type: "string" },
      },
    } as const

    const store = tinybaseCreateStore().setTablesSchema(tableSchema)

    // create indexed db persister
    const persister = createIndexedDbPersister(store, "global")
    // load from existing store if it exists
    await persister.load()

    const globalLinks = store.getTable("globalLinks")
    // check if global links are empty in store
    if (!store.hasTable("globalLinks")) {
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

    const queries = createQueries(store)
    queries.setQueryDefinition(
      "allGlobalLinks",
      "globalLinks",
      ({ select }) => {
        select("id")
        select("title")
        select("url")
      },
    )

    const db = await create({
      schema: {
        id: "string",
        title: "string",
        url: "string",
      },
    })

    const promises: Promise<string>[] = []
    store.forEachRow("globalLinks", (rowId, _) => {
      const row = store.getRow("globalLinks", rowId)
      promises.push(
        insert(db, {
          id: row.id,
          url: row.url,
          title: row.title,
        }),
      )
    })

    await Promise.all(promises)

    setGlobalLinkSearchDb(db)

    const allGlobalLinksResult = await search(globalLinkSearchDb(), {
      term: "",
      properties: ["title"],
    })
    const links = allGlobalLinksResult.hits.map((hit) => {
      return hit.document
    })
    console.log(links, "links")
    setState({ globalLinks: links })
  })

  return {
    state,
    setGlobalTopicsSearchList: (list: GlobalTopicSearchItem[]) => {
      setState({ globalTopicsSearchList: list })
    },
    searchGlobalLinksByTitle: async (title: string) => {
      const searchResult = await search(globalLinkSearchDb(), {
        term: title,
        properties: ["title"],
        threshold: 0.5,
      })

      console.log(
        searchResult.hits.map((hit) => hit.document),
        "results",
      )
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
