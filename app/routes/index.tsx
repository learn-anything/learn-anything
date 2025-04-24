import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { Outlet } from "@tanstack/react-router"
import Sidebar from "~/components/Sidebar"

function RootLayout() {
  const [sidebarWidth, setSidebarWidth] = useState(250)

  return (
    <div className="flex h-screen flex-1 overflow-auto">
      <Outlet />
    </div>
  )
}

export const Route = createFileRoute("/")({
  component: RootLayout,
})
