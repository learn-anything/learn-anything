"use client"

import { ClerkProvider } from "@clerk/nextjs"

export const ClerkProviderClient = ({ children }: { children: React.ReactNode }) => {
	return <ClerkProvider>{children}</ClerkProvider>
}
