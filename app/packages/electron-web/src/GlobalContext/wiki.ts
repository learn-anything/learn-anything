import { onMount } from "solid-js"
import { createStore } from "solid-js/store"

type Wiki = {
  filePath: string
  fileContent: string
  topicName: string
  topicContent: string
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

export default function createWikiState() {
  const [wiki, setWiki] = createStore<Wiki>({
    filePath: "",
    fileContent: "",
    topicName: "",
    topicContent: "",
    prettyName: "",
    notes: [],
    links: [],
  })

  // on first load, get last opened topic
  onMount(async () => {
    // TODO:
  })

  // TODO: maybe there is way to generate the actions to update one value
  // instead of having to write it eat
  return {
    // state
    wiki,
    // actions
    setFilePath: (state: string) => {
      return setWiki({ filePath: state })
    },
  }
}
