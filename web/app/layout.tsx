import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/lib/providers/theme-provider"
import "./globals.css"

import { ClerkProviderClient } from "@/components/custom/clerk/clerk-provider-client"
import { JotaiProvider } from "@/lib/providers/jotai-provider"
import { Toaster } from "@/components/ui/sonner"
import { ConfirmProvider } from "@/lib/providers/confirm-provider"
import { KeybindProvider } from "@/lib/providers/keybind-provider"

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans"
})

export const metadata: Metadata = {
	title: "Learn Anything",
	description: "Organize world's knowledge, explore connections and curate learning paths"
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="h-full w-full" suppressHydrationWarning>
			<ClerkProviderClient>
				<body className={cn("h-full w-full font-sans antialiased", fontSans.variable)}>
					<KeybindProvider>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
							<JotaiProvider>
								<ConfirmProvider>
									{children}
									<Toaster expand={false} />
								</ConfirmProvider>
							</JotaiProvider>
						</ThemeProvider>
					</KeybindProvider>
				</body>
			</ClerkProviderClient>
		</html>
	)
}
