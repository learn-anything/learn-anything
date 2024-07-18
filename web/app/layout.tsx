import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/lib/providers/theme-provider"
import "./globals.css"
import { JazzProvider } from "@/lib/providers/jazz-provider"
import { JotaiProvider } from "@/lib/providers/jotai-provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
})

export const metadata: Metadata = {
  title: "Learn Anything",
  description:
    "Organize world's knowledge, explore connections and curate learning paths"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="fixed h-full w-full overflow-hidden">
      <body
        className={cn(
          "fixed h-full w-full overflow-hidden font-sans antialiased",
          fontSans.variable
        )}
      >
        <JazzProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <JotaiProvider>{children}</JotaiProvider>
          </ThemeProvider>
        </JazzProvider>
      </body>
    </html>
  )
}
