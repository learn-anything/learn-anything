"use client"

import { SignedIn } from "@clerk/nextjs"

export const SignedInClient = ({ children }: { children: React.ReactNode }) => {
	return <SignedIn>{children}</SignedIn>
}
