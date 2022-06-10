// @refresh reload
import { Links, Meta, Routes, Scripts } from "solid-start/root"
import { ErrorBoundary } from "solid-start/error-boundary"
import { Suspense } from "solid-js"
import "./index.css"
import { Debugger } from "/Users/nikiv/clones/solid-devtools/packages/debugger/"

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body class="antialiased">
        <Debugger>
          <ErrorBoundary>
            <Suspense>
              <Routes />
            </Suspense>
          </ErrorBoundary>
          <Scripts />
        </Debugger>
      </body>
    </html>
  )
}
