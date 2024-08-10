import type { Metadata } from "next"
// import { Inter as FontSans } from "next/font/google"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/lib/providers/theme-provider"
import "./globals.css"
import { JazzProvider } from "@/lib/providers/jazz-provider"
import { JotaiProvider } from "@/lib/providers/jotai-provider"
import { Toaster } from "@/components/ui/sonner"
import { ConfirmProvider } from "@/lib/providers/confirm-provider"

// const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans"
// })

const inter = Inter({
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
			<body className={cn("h-full w-full font-sans antialiased", inter.variable)}>
				<JazzProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<JotaiProvider>
							<ConfirmProvider>
								{children}
								<Toaster />
							</ConfirmProvider>
						</JotaiProvider>
					</ThemeProvider>
				</JazzProvider>
			</body>
		</html>
	)
}
