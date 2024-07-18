import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/lib/providers/theme-provider"
import "./globals.css"

import dynamic from "next/dynamic"

const JazzProvider = dynamic(
  () => import("@/lib/providers/jazz-provider").then((mod) => mod.JazzProvider),
  {
    ssr: false
  }
)

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
            {children}
          </ThemeProvider>
        </JazzProvider>
      </body>
    </html>
  )
}
