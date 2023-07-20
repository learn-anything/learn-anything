import { createContext, onMount, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { getTopic, getUserDetails, getTopicsSidebar } from "#preload"

// holds all the global state of user
// persisted to sqlite with tinybase
export function createUserState() {
  const [user, setUser] = createStore({
    showCommandPalette: false,
    topicToEdit: "SQLite", // topic to show for editing
    topicContent: "", // markdown content of topic
    wikiFolderPath: "", // path to wiki folder connected to the wiki
    showSettings: false, // TODO: should be part of router
    showSignIn: false, // TODO: should be part of router
    sidebarTopics: [], // TODO: how to type it as string[]
  })

  // on first load of app, get all user state from tinybase
  onMount(async () => {
    const userDetails = await getUserDetails()
    const topic = await getTopic(userDetails.topicToEdit)
    const sidebarTopics = await getTopicsSidebar()

    console.log(topic, "topic!!")
    setUser({
      topicToEdit: userDetails.topicToEdit,
      // topicContent: topic.fileContent,
      wikiFolderPath: userDetails.wikiFolderPath,
      sidebarTopics,
    })
  })

  return {
    // state
    user,
    // actions
    setShowSettings: (state: boolean) => {
      return setUser({ showSettings: state })
    },
    // TODO: part of router
    setShowSignIn: (state: boolean) => {
      return setUser({ showSignIn: state })
    },
    setWikiFolderPath: (state: string) => {
      return setUser({ wikiFolderPath: state })
    },
    setShowCommandPalette: (state: boolean) => {
      return setUser({ showCommandPalette: state })
    },
    setTopicToEdit: (state: string) => {
      return setUser({ topicToEdit: state })
    },
  } as const
}

const UserCtx = createContext<ReturnType<typeof createUserState>>()

export const UserProvider = UserCtx.Provider

export const useUser = () => {
  const ctx = useContext(UserCtx)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
