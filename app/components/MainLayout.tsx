import { Outlet } from "@tanstack/react-router"
import Sidebar from "./Sidebar"
import { useState } from "react"

export default function MainLayout() {
  const [sidebarWidth, setSidebarWidth] = useState(250)

  return (
    <div className="flex h-screen">
      <Sidebar width={sidebarWidth} onWidthChange={setSidebarWidth} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
