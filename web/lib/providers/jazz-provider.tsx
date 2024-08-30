"use client"

import { createJazzReactApp } from "jazz-react"
import { LaAccount } from "@/lib/schema"
import { useClerk } from "@clerk/nextjs"
import { createContext, useMemo, useState } from "react"
import { AuthMethodCtx } from "jazz-react"

const Jazz = createJazzReactApp({
	AccountSchema: LaAccount
})

export const { useAccount, useCoState, useAcceptInvite } = Jazz

export function JazzProvider({ children }: { children: React.ReactNode }) {
	return <Jazz.Provider peer="wss://mesh.jazz.tools/?key=example@gmail.com">{children}</Jazz.Provider>
}

export const JazzClerkAuthCtx = createContext<{
	errors: string[]
}>({
	errors: []
})

export function JazzClerkAuth({ children }: { children: React.ReactNode }) {
	const clerk = useClerk()
	const [errors, setErrors] = useState<string[]>([])

	const authMethod = useMemo(() => {
		return new BrowserClerkAuth(
			{
				onError: error => {
					void clerk.signOut()
					setErrors(errors => [...errors, error.toString()])
				}
			},
			clerk
		)
	}, [clerk])

	return (
		<JazzClerkAuthCtx.Provider value={{ errors }}>
			<AuthMethodCtx.Provider value={authMethod}>{children}</AuthMethodCtx.Provider>
		</JazzClerkAuthCtx.Provider>
	)
}

import { Account, AuthMethod, AuthResult, ID } from "jazz-tools"
import type { LoadedClerk } from "@clerk/types"
import { AgentSecret } from "cojson"

export class BrowserClerkAuth implements AuthMethod {
	constructor(
		public driver: BrowserClerkAuth.Driver,
		private readonly clerkClient: LoadedClerk
	) {}

	async start(): Promise<AuthResult> {
		if (this.clerkClient.user) {
			const storedCredentials = this.clerkClient.user.unsafeMetadata
			if (storedCredentials.jazzAccountID) {
				if (!storedCredentials.jazzAccountSecret) {
					throw new Error("No secret for existing user")
				}
				return {
					type: "existing",
					credentials: {
						accountID: storedCredentials.jazzAccountID as ID<Account>,
						secret: storedCredentials.jazzAccountSecret as AgentSecret
					},
					onSuccess: () => {},
					onError: (error: string | Error) => {
						this.driver.onError(error)
					}
				}
			} else {
				return {
					type: "new",
					creationProps: {
						name: this.clerkClient.user.fullName || this.clerkClient.user.username || this.clerkClient.user.id
					},
					saveCredentials: async (credentials: { accountID: ID<Account>; secret: AgentSecret }) => {
						await this.clerkClient.user?.update({
							unsafeMetadata: {
								jazzAccountID: credentials.accountID,
								jazzAccountSecret: credentials.secret
							}
						})
					},
					onSuccess: () => {},
					onError: (error: string | Error) => {
						this.driver.onError(error)
					}
				}
			}
		} else {
			throw new Error("Not signed in")
		}
	}
}

export namespace BrowserClerkAuth {
	export interface Driver {
		onError: (error: string | Error) => void
	}
}
