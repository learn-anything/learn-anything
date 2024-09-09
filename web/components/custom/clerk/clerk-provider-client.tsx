"use client"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useEffect, useState } from "react"

export const ClerkProviderClient = ({ children }: { children: React.ReactNode }) => {
	const [darkMode, setDarkMode] = useState(false)

	useEffect(() => {
		const updateTheme = () => {
			setDarkMode(document.documentElement.classList.contains("dark"))
		}
		updateTheme()

		const observer = new MutationObserver(updateTheme)
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

		return () => observer.disconnect()
	}, [])

	return (
		<ClerkProvider
			appearance={{
				baseTheme: darkMode ? dark : undefined,
				variables: { colorPrimary: darkMode ? "#dddddd" : "#2e2e2e" }
			}}
		>
			{children}
		</ClerkProvider>
	)
}
