import { createFileRoute } from "@tanstack/react-router"
import { Outlet } from "@tanstack/react-router"

function RootLayout() {
  return (
    <div className="flex h-screen flex-1 overflow-auto">
      <Outlet />
    </div>
  )
}

export const Route = createFileRoute("/")({
  component: RootLayout,
})
