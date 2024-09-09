"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

interface ClerkProviderClientProps {
	children: React.ReactNode
}

export const ClerkProviderClient: React.FC<ClerkProviderClientProps> = ({ children }) => {
	const { theme, systemTheme } = useTheme()

	const isDarkTheme = theme === "dark" || (theme === "system" && systemTheme === "dark")

	const appearance = {
		baseTheme: isDarkTheme ? dark : undefined,
		variables: { colorPrimary: isDarkTheme ? "#dddddd" : "#2e2e2e" }
	}

	return <ClerkProvider appearance={appearance}>{children}</ClerkProvider>
}
