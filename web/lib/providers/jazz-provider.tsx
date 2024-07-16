"use client"

import { createJazzReactContext, DemoAuth } from "jazz-react"

const Jazz = createJazzReactContext({
  auth: DemoAuth({ appName: "Learn Anything" }),
  peer: "wss://mesh.jazz.tools/?key=iupin5212@gmail.com" // <- put your email here to get a proper API key later
})

export const { useAccount, useCoState } = Jazz

export function JazzProvider({ children }: { children: React.ReactNode }) {
  return <Jazz.Provider>{children}</Jazz.Provider>
}
