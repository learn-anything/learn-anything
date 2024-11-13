import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/_pages/_protected")({
  beforeLoad: async ({ context, location }) => {
    // Add extra validation
    if (!context || !context.auth) {
      throw redirect({
        to: "/sign-in/$",
        search: { redirect_url: location.pathname },
      })
    }

    const auth = await context.auth

    if (!auth?.userId) {
      throw redirect({
        to: "/sign-in/$",
        search: { redirect_url: location.pathname },
      })
    }

    return context
  },
  component: () => <Outlet />,
})
