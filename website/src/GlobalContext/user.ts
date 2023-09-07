import { createContext, useContext } from "solid-js"
import { createStore } from "solid-js/store"

type User = {
  username: string
  email: string
}

// global state of user
export function createUserState() {
  const [user, setUser] = createStore<User>({
    username: "nikiv",
    email: "nikita@nikiv.dev",
  })

  return {
    // state
    user,
    // actions
  } as const
}

const UserCtx = createContext<ReturnType<typeof createUserState>>()

export const UserProvider = UserCtx.Provider

export const useUser = () => {
  const ctx = useContext(UserCtx)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
