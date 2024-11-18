import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/(auth)/_auth")({
  beforeLoad: async ({ context }) => {
    const auth = await context.auth
    if (auth?.userId) {
      throw redirect({ to: "/links", replace: true })
    }
  },
  component: () => (
    <main className="h-full">
      <Outlet />
    </main>
  ),
})
