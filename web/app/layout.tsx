import type { Metadata, Viewport } from "next"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/lib/providers/theme-provider"
import "./globals.css"
import { ClerkProviderClient } from "@/components/custom/clerk/clerk-provider-client"
import { JotaiProvider } from "@/lib/providers/jotai-provider"
import { Toaster } from "@/components/ui/sonner"
import { ConfirmProvider } from "@/lib/providers/confirm-provider"
import { DeepLinkProvider } from "@/lib/providers/deep-link-provider"
import { GeistMono, GeistSans } from "./fonts"
import { JazzAndAuth } from "@/lib/providers/jazz-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

export const viewport: Viewport = {
	width: "device-width",
	height: "device-height",
	initialScale: 1,
	viewportFit: "cover"
}

export const metadata: Metadata = {
	title: "Learn Anything",
	description: "Organize world's knowledge, explore connections and curate learning paths"
}

const Providers = ({ children }: { children: React.ReactNode }) => (
	<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
		<ClerkProviderClient>
			<DeepLinkProvider>
				<JotaiProvider>
					<TooltipProvider>
						<ConfirmProvider>
							<JazzAndAuth>{children}</JazzAndAuth>
						</ConfirmProvider>
					</TooltipProvider>
				</JotaiProvider>
			</DeepLinkProvider>
		</ClerkProviderClient>
	</ThemeProvider>
)

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="h-full w-full" suppressHydrationWarning>
			<body className={cn("h-full w-full font-sans antialiased", GeistSans.variable, GeistMono.variable)}>
				<Providers>
					{children}

					<Toaster expand={false} />
				</Providers>
			</body>
		</html>
	)
}
