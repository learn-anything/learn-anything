import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/(auth)/_auth")({
  component: () => (
    <main className="h-full">
      <Outlet />
    </main>
  ),
})
