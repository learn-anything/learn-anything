import { createContext, onMount, useContext } from "solid-js"
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

  onMount(() => {
    // TODO: do grafbase call to get user info like username and email from server

    // TODO: move this cookie reading into lib function
    // also there has to be better way to do this than this
    const allCookies = document.cookie
    const hankoCookie = allCookies
      .split(";")
      .find((cookie) => {
        return cookie
      })
      ?.split("=")[1]
    if (hankoCookie) {
      setUser({ signedIn: true })
    }
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
