import { createContext, createEffect, onMount, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { captureStoreUpdates } from "@solid-primitives/deep"

type Wiki = {
  // sidebar: any // TODO: model how to do sidebar, derive it or store?
  wikiFolderPath: string // path to wiki folder connected to the wiki
  topics: Topic[]
  openTopic: OpenTopic
}

type Topic = {
  name: string
}

type OpenTopic = {
  filePath: string
  fileContent: string
  topicName: string
  topicContent: string // markdown content of topic
  prettyName: string
  notes: Note[]
  links: Link[]
}

type Note = {
  content: string
  url: string
  public: boolean
}

type Link = {
  title: string
  url: string
  public: boolean
}

// global state of wiki
export default function createWikiState() {
  const [wiki, setWiki] = createStore<Wiki>({
    wikiFolderPath: "test/path", // TODO: temp, load from tinybase
    topics: [{ name: "wow" }],
    openTopic: {
      topicName: "",
      prettyName: "",
      topicContent: "",
      notes: [],
      links: [],
      filePath: "",
      fileContent: "",
    },
  })

  // on first load, get last opened topic
  onMount(async () => {
    // TODO:
  })

  const getDelta = captureStoreUpdates(wiki)

  createEffect(() => {
    // when store changes, delta includes new store value
    const delta = getDelta()
    /* execute some logic whenever the state changes */
    console.log(delta, "delta")

    // TODO: assume delta is an array of length 1
    // in what case can it be more than 1?
    const value = delta[0]
  })

  // TODO: maybe there is way to generate the actions to update one value
  // instead of having to write it eat
  return {
    // state
    wiki,
    // actions
    setWikiFolderPath: (state: string) => {
      return setWiki({ wikiFolderPath: state })
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
