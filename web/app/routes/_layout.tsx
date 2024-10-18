import { Outlet, createFileRoute } from "@tanstack/react-router"
import { ThemeProvider } from "next-themes"
import { ClerkProvider } from "~/lib/providers/clerk-provider"

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ClerkProvider>
        <Outlet />
      </ClerkProvider>
    </ThemeProvider>
  )
}
