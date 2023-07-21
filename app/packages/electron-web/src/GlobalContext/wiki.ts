import { createContext, createEffect, onMount, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { captureStoreUpdates } from "@solid-primitives/deep"
import { updateWiki, getTopicsSidebar, getTopic } from "#preload"
import { unwrap } from "solid-js/store"
import { Wiki } from "../../../../types/wiki"

// see app/packages/preload/src/tinybase/tinybase.ts
// to understand schema of tinybase store
// this solid store is a subset of tinybase store
// changes made to solid store are synced to tinybase store
// which in turn writes to sqlite

// global state of wiki
export default function createWikiState() {
  const [wiki, setWiki] = createStore<Wiki>({
    wikiFolderPath: "test/path", // TODO: temp, load from tinybase
    openTopic: {
      topicName: "",
      prettyName: "",
      topicContent: "",
      notes: [],
      links: [],
      filePath: "",
      fileContent: "",
    },
    sidebarTopics: [],
  })

  // on first load, get last opened topic + sidebar
  onMount(async () => {
    // TODO:
    const sidebarTopics = await getTopicsSidebar()
    setWiki({ sidebarTopics: sidebarTopics })
    // console.log(sidebarTopics, "sidebar")
  })

  const getDelta = captureStoreUpdates(wiki)

  createEffect(async () => {
    // when store changes, delta includes new store value
    const delta = getDelta()
    // console.log(delta, "delta")

    // TODO: assume delta is an array of length 1
    // in what case can it be more than 1?
    const newStore = delta[0].value
    // console.log(newStore, "new store")

    // TODO: how to know what exactly changed in between deltas

    // for now load entire new store into tinybase
    // TODO: should I await this?
    // TODO: don't do `as ..` type
    // TODO: don't run updateWiki on first load
    await updateWiki(unwrap(newStore as Wiki))
  })

  // TODO: maybe there is way to generate the actions to update one value
  // instead of having to write it out manually
  return {
    // state
    wiki,
    // actions
    setWikiFolderPath: (state: string) => {
      return setWiki({ wikiFolderPath: state })
    },
    setOpenTopic: async (pretyName: string) => {
      const topic = await getTopic(pretyName)
      console.log("adding this topic")
      console.log(topic, "topic")
      return setWiki((prevWiki) => ({ ...prevWiki, openTopic: topic }))
    },
  }
}

const WikiCtx = createContext<ReturnType<typeof createWikiState>>()

export const WikiProvider = WikiCtx.Provider

export const useWiki = () => {
  const ctx = useContext(WikiCtx)
  if (!ctx) throw new Error("useWiki must be used within UserProvider")
  return ctx
}
