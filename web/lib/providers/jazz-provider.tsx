"use client"

import { createJazzReactApp } from "jazz-react"
import { LaAccount } from "@/lib/schema"
import { useAuth, useClerk } from "@clerk/nextjs"
import { useJazzClerkAuth } from "jazz-react-auth-clerk"

const Jazz = createJazzReactApp({
	AccountSchema: LaAccount
})

export const { useAccount, useAccountOrGuest, useCoState, useAcceptInvite } = Jazz

export function JazzAndAuth({ children }: { children: React.ReactNode }) {
	const clerk = useClerk()
	const { isLoaded } = useAuth()
	const [authMethod, state] = useJazzClerkAuth(clerk)

	if (!isLoaded) return null

	return (
		<>
			{state.errors.map(error => (
				<div key={error}>{error}</div>
			))}
			<Jazz.Provider auth={authMethod || "guest"} peer="wss://mesh.jazz.tools/?key=example@gmail.com">
				{children}
			</Jazz.Provider>
		</>
	)
}
