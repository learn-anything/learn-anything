/// <reference types="vite/client" />
import { getAuth } from "@clerk/tanstack-start/server"
import type { QueryClient } from "@tanstack/react-query"
import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import {
  Body,
  createServerFn,
  Head,
  Html,
  Meta,
  Scripts,
} from "@tanstack/start"
import * as React from "react"
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary.js"
import { NotFound } from "~/components/NotFound.js"
import appCss from "~/styles/app.css?url"

export const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )

export const ReactQueryDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/react-query-devtools").then((d) => ({
          default: d.ReactQueryDevtools,
        })),
      )

export const fetchClerkAuth = createServerFn("GET", async (_, ctx) => {
  const auth = await getAuth(ctx.request)

  return auth
})

export const Route = createRootRouteWithContext<{
  auth: { userId: string }
  queryClient: QueryClient
}>()({
  meta: () => [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
  ],
  links: () => [
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
  beforeLoad: async ({ context }) => {
    if (context.auth) {
      return { auth: context.auth }
    }

    const auth = await fetchClerkAuth()
    return { auth }
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
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
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        {children}

        <React.Suspense>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </React.Suspense>

        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  )
}
