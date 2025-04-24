import { createFileRoute } from "@tanstack/react-router"
import { Outlet } from "@tanstack/react-router"

function RouteComponent() {
  return <Outlet />
}

export const Route = createFileRoute("/daily")({
  component: RouteComponent,
})
