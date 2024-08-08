"use client"

import { createJazzReactContext, DemoAuth } from "jazz-react"
import { AuthUI } from "@/components/custom/auth-ui"
import { LaAccount } from "@/lib/schema"

const appName = process.env.NEXT_PUBLIC_APP_NAME!

const auth = DemoAuth<LaAccount>({
	appName,
	Component: AuthUI,
	accountSchema: LaAccount
})

const Jazz = createJazzReactContext({
	auth,
	peer: "wss://mesh.jazz.tools/?key=example@gmail.com"
})

export const { useAccount, useCoState, useAcceptInvite } = Jazz

export function JazzProvider({ children }: { children: React.ReactNode }) {
	return <Jazz.Provider>{children}</Jazz.Provider>
}
