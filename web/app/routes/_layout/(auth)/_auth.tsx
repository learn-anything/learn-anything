import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/(auth)/_auth")({
  beforeLoad({ context }) {
    if (context.auth?.userId) {
      throw redirect({ to: "/links", replace: true })
    }
  },
  component: () => (
    <main className="h-full">
      <Outlet />
    </main>
  ),
})
