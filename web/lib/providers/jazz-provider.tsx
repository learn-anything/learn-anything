"use client"

import { createJazzReactContext } from "jazz-react"
import { DemoAuth } from "@/components/custom/demo-auth"
import { LaAccount } from "../schema"

const Jazz = createJazzReactContext({
	auth: DemoAuth({ appName: "Learn Anything", accountSchema: LaAccount }),
	peer: "wss://mesh.jazz.tools/?key=iupin5212@gmail.com" // <- put your email here to get a proper API key later
})

export const { useAccount, useCoState } = Jazz

export function JazzProvider({ children }: { children: React.ReactNode }) {
	return <Jazz.Provider>{children}</Jazz.Provider>
}
