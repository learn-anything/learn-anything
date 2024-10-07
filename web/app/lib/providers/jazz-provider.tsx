import { createJazzReactApp } from "jazz-react"
import { LaAccount } from "@/lib/schema"
import { useJazzClerkAuth } from "jazz-react-auth-clerk"
import { useAuth, useClerk } from "@clerk/tanstack-start"
import { useLocation } from "@tanstack/react-router"
import { getEnvVariable } from "../utils"
import { AuthMethod } from "jazz-tools"

const Jazz = createJazzReactApp({
  AccountSchema: LaAccount,
})

export const { useAccount, useAccountOrGuest, useCoState, useAcceptInvite } =
  Jazz

function assertPeerUrl(
  url: string | undefined,
): asserts url is `wss://${string}` | `ws://${string}` {
  if (!url) {
    throw new Error("JAZZ_PEER_URL is not defined")
  }
  if (!url.startsWith("wss://") && !url.startsWith("ws://")) {
    throw new Error("JAZZ_PEER_URL must start with wss:// or ws://")
  }
}

const JAZZ_PEER_URL = (() => {
  const rawUrl = getEnvVariable("VITE_JAZZ_PEER_URL")
  assertPeerUrl(rawUrl)
  return rawUrl
})()

interface ChildrenProps {
  children: React.ReactNode
}

export function JazzAndAuth({ children }: ChildrenProps) {
  const { pathname } = useLocation()
  const Component = pathname === "/" ? JazzGuest : JazzAuth
  return <Component>{children}</Component>
}

export function JazzAuth({ children }: ChildrenProps) {
  const clerk = useClerk()
  const { isLoaded, isSignedIn } = useAuth()
  const [authMethod] = useJazzClerkAuth(clerk)

  if (!isLoaded) return null
  if (!isSignedIn) return <JazzGuest>{children}</JazzGuest>
  if (!authMethod) return null

  return <JazzProvider auth={authMethod}>{children}</JazzProvider>
}

export function JazzGuest({ children }: ChildrenProps) {
  return <JazzProvider auth="guest">{children}</JazzProvider>
}

function JazzProvider({
  auth,
  children,
}: {
  auth: AuthMethod | "guest"
  children: React.ReactNode
}) {
  return (
    <Jazz.Provider auth={auth} peer={JAZZ_PEER_URL}>
      {children}
    </Jazz.Provider>
  )
}
