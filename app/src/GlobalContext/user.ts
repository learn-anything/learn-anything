import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"

type User = {
  showCommandPalette: boolean
  showSettings: boolean
  showSignIn: boolean
  mode: Mode
}

type Mode =
  | "Default"
  | "Settings"
  | "Command Palette"
  | "Search Topics"
  | "New Topic"
  | "New Note"
  | "New Link"
  | "Settings"

// TODO: add router
// currently using this store to do things router should do
// like `showSignIn`

// global state of user
export function createUserState() {
  const [user, setUser] = createStore<User>({
    showCommandPalette: false,
    showSettings: false,
    showSignIn: false,
    mode: "Default",
  })

  return {
    user,
    setShowCommandPalette: (state: boolean) => {
      return setUser({ showCommandPalette: state })
    },
    setShowSettings: (state: boolean) => {
      return setUser({ showSettings: state })
    },
    setShowSignIn: (state: boolean) => {
      return setUser({ showSignIn: state })
    },
    setMode: (state: Mode) => {
      return setUser({ mode: state })
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
