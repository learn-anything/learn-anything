import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"

type User = {
  username: string
  email: string
  signedIn: boolean
}

// global state of user
export function createUserState() {
  const [user, setUser] = createStore<User>({
    username: "",
    email: "",
    signedIn: false,
  })

  return {
    user,
    setSignedIn: (state: boolean) => {
      return setUser({ signedIn: state })
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
