import { UserClient } from "@teamhanko/hanko-frontend-sdk"
import { createContext, createEffect, onMount, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { MobiusType } from "../root"
import { getHankoCookie } from "../../lib/auth"
import { useLocation } from "solid-start"

type Topic = {
  name: string
  prettyName: string
}

type User = {
  username: string
  email: string
  signedIn: boolean
  member: boolean
  admin: boolean
  topicsIdsToLearn: Topic[]
  topicsIdsToLearning: Topic[]
  topicsIdsLearned: Topic[]
}

// global state of user
export function createUserState(mobius: MobiusType) {
  const [user, setUser] = createStore<User>({
    username: "",
    email: "",
    signedIn: false,
    member: true,
    admin: true,
    topicsIdsToLearn: [],
    topicsIdsToLearning: [],
    topicsIdsLearned: []
  })

  onMount(async () => {
    // TODO: maybe not needed? if only userClient.getCurrent() is there
    // it flashes sign in button on reloads..
    if (getHankoCookie()) {
      setUser({ signedIn: true })
    }
    // TODO: do grafbase call to get user info like username and email from server
    const userClient = new UserClient(import.meta.env.VITE_HANKO_API, {
      timeout: 0,
      cookieName: "hanko",
      localStorageKey: "hanko"
    })
    const hankoUser = await userClient.getCurrent()
    const email = hankoUser.email
    setUser({ email, signedIn: true })

    // TODO: check it works well
    const res = await mobius.query({
      getUserDetails: {
        isMember: true
      }
    })
    if (res) {
      // @ts-ignore
      // setUser({ member: res?.data?.getUserDetails.isMember })
    }

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

  const location = useLocation()

  createEffect(async () => {
    if (!(location.pathname === "/profile")) return
    const res = await mobius.query({
      getTopicsLearned: {
        topicsToLearn: {
          name: true,
          prettyName: true
        },
        topicsLearning: {
          name: true,
          prettyName: true
        },
        topicsLearned: {
          name: true,
          prettyName: true
        }
      }
    })
    console.log(res, "res")
  })

  return {
    user,
    setEmail: (state: string) => {
      return setUser({ email: state })
    },
    setSignedIn: (state: boolean) => {
      return setUser({ signedIn: state })
    }
  } as const
}

const UserCtx = createContext<ReturnType<typeof createUserState>>()

export const UserProvider = UserCtx.Provider

export const useUser = () => {
  const ctx = useContext(UserCtx)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
