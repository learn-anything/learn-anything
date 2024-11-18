/// <reference types="vite/client" />
import { getAuth } from "@clerk/tanstack-start/server"
import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { createServerFn, Meta, Scripts } from "@tanstack/start"
import * as React from "react"
import { getWebRequest } from "vinxi/http"
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary.js"
import { NotFound } from "~/components/NotFound.js"
import { seo } from "~/lib/utils/seo"
import appCss from "~/styles/app.css?url"

export const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )

export const fetchClerkAuth = createServerFn().handler(async () => {
  const auth = await getAuth(getWebRequest())

  return auth
})

export const Route = createRootRouteWithContext<{
  auth?: ReturnType<typeof getAuth> | null
}>()({
  head() {
    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        ...seo({
          title: "Learn Anything",
          description:
            "Discover and learn about any topic with Learn-Anything. Our free, comprehensive platform connects you to the best resources for every subject. Start learning today!",
          keywords:
            "learn anything, online learning, free education, educational resources, self-study, knowledge discovery, topic exploration, skill development, lifelong learning",
        }),
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
        { rel: "icon", href: "/favicon.ico" },
      ],
    }
  },

  beforeLoad: async (ctx) => {
    try {
      // Handle explicit null auth (logged out state)
      if (ctx.context.auth === null) {
        return { auth: null }
      }

      // Use existing auth if available
      if (ctx.context.auth) {
        return { auth: ctx.context.auth }
      }

      // Fetch new auth state
      const auth = await fetchClerkAuth()
      return { auth }
    } catch (error) {
      console.error("Error in beforeLoad:", error)
      return { auth: null }
    }
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  pendingComponent: () => (
    <RootDocument>
      <div>Loading...</div>
    </RootDocument>
  ),
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <Meta />
      </head>
      <body>
        {children}

        <ScrollRestoration />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
