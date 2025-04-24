import { createFileRoute, Outlet } from "@tanstack/react-router"
import { JazzProvider } from "jazz-react"
import { JazzInspector } from "jazz-inspector"
import { JazzAccount } from "~/jazz-schema"
import { useState } from "react"
import Sidebar from "~/components/Sidebar"

function LayoutComponent() {
  const [sidebarWidth, setSidebarWidth] = useState(250)

  return (
    <JazzProvider
      sync={{
        peer: "wss://cloud.jazz.tools/?key=jazz@preprompt.app", // which server peer to sync jazz state with
        when: "signedUp", // this way when user hasn't signed up, data is stored locally
      }}
      AccountSchema={JazzAccount}
    >
      <div className="flex h-screen">
        <Sidebar width={sidebarWidth} onWidthChange={setSidebarWidth} />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
      {/* TODO: pr jazz to pass prop to hide visual button */}
      {/* TODO: pr jazz to make it work with dark mode nicely */}
      <div className="hidden">
        <JazzInspector />
      </div>
    </JazzProvider>
  )
}

export const Route = createFileRoute("/_app")({
  component: LayoutComponent,
})
