"use client"

import { createJazzReactApp } from "jazz-react"
import { LaAccount } from "@/lib/schema"
import { useClerk } from "@clerk/nextjs"
import { createContext, useMemo, useState } from "react"
import { useJazzClerkAuth } from "jazz-react-auth-clerk"

const Jazz = createJazzReactApp({
	AccountSchema: LaAccount
})

export const { useAccount, useCoState, useAcceptInvite } = Jazz

export function JazzAndAuth({ children }: { children: React.ReactNode }) {
	const clerk = useClerk()

	const [auth, state] = useJazzClerkAuth(clerk)

	return (
		<>
			{state.errors.map((error) => (
				<div key={error}>{error}</div>
			))}
			<Jazz.Provider auth={auth || "guest"} peer="wss://mesh.jazz.tools/?key=example@gmail.com">
				{children}
			</Jazz.Provider>
		</>
	)
}

export const JazzClerkAuthCtx = createContext<{
	errors: string[]
}>({
	errors: []
})
