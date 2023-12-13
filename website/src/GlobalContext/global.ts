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
import { useLocation } from "solid-start"

type GlobalLink = {
  id: string
  url: string
  title: string
}

type TopicWithConnections = {
  name: string
  prettyName: string
  connections: string[]
}

type GlobalState = {
  globalLinks: GlobalLink[]
  globalLinkSearchDb: any
  guidePage: string
  theme: string
  topicsWithConnections: TopicWithConnections[]
  showSidebar: boolean
  mode:
    | "Default"
    | "cannot-update-topic-learning-status"
    | "cannot-update-global-link-status"
}

// various global state
export function createGlobalState(mobius: MobiusType) {
  const [state, setState] = createStore<GlobalState>({
    globalLinks: [],
    globalLinkSearchDb: undefined,
    guidePage: "Guide",
    theme: "",
    showSidebar: false,
    topicsWithConnections: [],
    mode: "Default"
  })
  const [showMemberOnlyModal, setShowMemberOnlyModal] = createSignal(false)
  const [showMemberOnlyModalWithMessage, setShowMemberOnlyModalWithMessage] =
    createSignal("")

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

  const location = useLocation()
  createEffect(async () => {
    // in all other pages, there is search bar on top, below is needed to do search + show connections in landing
    if (location.pathname === "/pricing") return

    const topicsAndConnections = localStorage.getItem("topicsAndConnections")
    if (topicsAndConnections) {
      setState("topicsWithConnections", JSON.parse(topicsAndConnections))
      return
    }

    const connections = await mobius.query({
      publicGetTopicsWithConnections: {
        name: true,
        prettyName: true,
        connections: true
      }
    })

    // @ts-ignore
    const connectionData = connections?.data?.publicGetTopicsWithConnections
    setState("topicsWithConnections", connectionData)
    localStorage.setItem("topicsAndConnections", JSON.stringify(connectionData))
  })

  // TODO: was attempt to make global search, probably should be removed
  // has some useful orama/tinybase reference code
  onMount(async () => {
    return
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
    set: setState,
    setGuidePage: (page: string) => {
      setState({ guidePage: page })
    },
    setShowSidebar: (boolean: boolean) => {
      setState({ showSidebar: boolean })
    },
    showMemberOnlyModal,
    setShowMemberOnlyModal,
    showMemberOnlyModalWithMessage,
    setShowMemberOnlyModalWithMessage,
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
