import type { Metadata } from "next"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/lib/providers/theme-provider"
import "./globals.css"
import { ClerkProviderClient } from "@/components/custom/clerk/clerk-provider-client"
import { JotaiProvider } from "@/lib/providers/jotai-provider"
import { Toaster } from "@/components/ui/sonner"
import { ConfirmProvider } from "@/lib/providers/confirm-provider"
import { DeepLinkProvider } from "@/lib/providers/deep-link-provider"
import { GeistMono, GeistSans } from "./fonts"

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
				<DeepLinkProvider>
					<body className={cn("h-full w-full font-sans antialiased", GeistSans.variable, GeistMono.variable)}>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
							<JotaiProvider>
								<ConfirmProvider>
									{children}
									<Toaster expand={false} />
								</ConfirmProvider>
							</JotaiProvider>
						</ThemeProvider>
					</body>
				</DeepLinkProvider>
			</ClerkProviderClient>
		</html>
	)
}
