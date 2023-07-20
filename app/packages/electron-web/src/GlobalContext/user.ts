import { createContext, onMount, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { getTopic, getUserDetails, getTopicsSidebar } from "#preload"

export type User = {
  showCommandPalette: boolean
  topicToEdit: string
  topicContent: string
  wikiFolderPath: string
  showSettings: boolean
  showSignIn: boolean
  sidebarTopics: string[]
}

// holds all the global state of user
// persisted to sqlite with tinybase
export function createUserState() {
  const [user, setUser] = createStore<User>({
    showCommandPalette: false,
    topicToEdit: "SQLite", // topic to show for editing
    topicContent: "", // markdown content of topic
    wikiFolderPath: "", // path to wiki folder connected to the wiki
    showSettings: false, // TODO: should be part of router
    showSignIn: false, // TODO: should be part of router
    sidebarTopics: [],
  })

  // on first load, get all user details
  // onMount(async () => {
  //   setUser({})
  // })

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
