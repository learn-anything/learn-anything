import { create, insert, search } from "@orama/orama"
import {
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext
} from "solid-js"
import { createStore } from "solid-js/store"
import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db/with-schemas"
import {
  createQueries,
  createStore as tinybaseCreateStore
} from "tinybase/with-schemas"
import { MobiusType } from "../root"

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
  guidePage: string
  theme: string
}

// various global state
export function createGlobalState(mobius: MobiusType) {
  const [state, setState] = createStore<GlobalState>({
    globalTopicsSearchList: [],
    globalLinks: [],
    globalLinkSearchDb: undefined,
    guidePage: "Guide",
    theme: ""
  })
  const [showMemberOnlyModal, setShowMemberOnlyModal] = createSignal(false)

  createEffect(() => {
    console.log(showMemberOnlyModal(), "modal show")
  })

  createEffect(() => {
    // Checks if its dark mode or light mode
    const themeChangeHandler = (e: any) => {
      if (e.matches) {
        setState({ theme: "dark" })
      } else {
        setState({ theme: "light" })
      }
    }

    const themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    // Initial check
    themeChangeHandler(themeMediaQuery)

    // Listen for changes
    themeMediaQuery.addEventListener("change", themeChangeHandler)
  })

  const [globalLinkSearchDb, setGlobalLinkSearchDb] =
    createSignal<any>(undefined)

  onMount(async () => {
    const topics = await mobius.query({
      publicGetGlobalTopics: {
        name: true,
        prettyName: true
      }
    })
    if (topics) {
      // @ts-ignore
      setState({ globalTopicsSearchList: topics.data.publicGetGlobalTopics })
    }
  })

  // onMount(async () => {
  //   const links = await mobius.query({
  //     getGlobalLinks: {
  //       id: true,
  //       url: true,
  //       title: true,
  //     },
  //   })
  //   console.log(links, "links!")
  // })

  onMount(async () => {
    const tableSchema = {
      globalLinks: {
        title: { type: "string" },
        url: { type: "string" },
        id: { type: "string" }
      }
    } as const

    const store = tinybaseCreateStore().setTablesSchema(tableSchema)

    // create indexed db persister
    const persister = createIndexedDbPersister(store, "global")
    // load from existing store if it exists
    await persister.load()

    const globalLinks = store.getTable("globalLinks")
    // check if global links are empty in store
    if (!store.hasTable("globalLinks")) {
      // console.log(globalLinks, "links")
      // const links = await mobius.query({
      //   getGlobalLinks: {
      //     id: true,
      //     url: true,
      //     title: true,
      //   },
      // })
      // console.log(links, "links")
      return

      if (links) {
        // @ts-ignore
        links.data.getGlobalLinks.map((link) => {
          store.addRow("globalLinks", {
            title: link.title,
            url: link.url,
            id: link.id
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
      }
    )

    const db = await create({
      schema: {
        id: "string",
        title: "string",
        url: "string"
      }
    })

    const promises: Promise<string>[] = []
    store.forEachRow("globalLinks", (rowId, _) => {
      const row = store.getRow("globalLinks", rowId)
      promises.push(
        insert(db, {
          id: row.id,
          url: row.url,
          title: row.title
        })
      )
    })

    await Promise.all(promises)

    setGlobalLinkSearchDb(db)

    const allGlobalLinksResult = await search(globalLinkSearchDb(), {
      term: "",
      properties: ["title"]
    })
    const links = allGlobalLinksResult.hits.map((hit) => {
      return hit.document
    })
    console.log(links, "links")
    console.log(links.length, "links length")
    setState({ globalLinks: links })
  })

  return {
    state,
    setGuidePage: (page: string) => {
      setState({ guidePage: page })
    },
    setGlobalTopicsSearchList: (list: GlobalTopicSearchItem[]) => {
      setState({ globalTopicsSearchList: list })
    },
    showMemberOnlyModal,
    setShowMemberOnlyModal,
    searchGlobalLinksByTitle: async (title: string) => {
      const searchResult = await search(globalLinkSearchDb(), {
        term: title,
        properties: ["title"],
        threshold: 0.5
      })

      console.log(
        searchResult.hits.map((hit) => hit.document),
        "results"
      )
    }
  } as const
}

const GlobalStateCtx = createContext<ReturnType<typeof createGlobalState>>()

export const GlobalStateProvider = GlobalStateCtx.Provider

export const useGlobalState = () => {
  const ctx = useContext(GlobalStateCtx)
  if (!ctx) throw new Error("useGlobalState must be used within UserProvider")
  return ctx
}
