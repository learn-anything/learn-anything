// @refresh reload
import { Suspense } from "solid-js"
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start"
import "./root.css"
import { UserProvider, createUserState } from "./GlobalContext/user"
import createWikiState, { WikiProvider } from "./GlobalContext/wiki"
import { GlobalStateProvider, createGlobalState } from "./GlobalContext/global"

export default function Root() {
  const user = createUserState()
  const wiki = createWikiState()
  const global = createGlobalState()

  return (
    <Html lang="en">
      <Head>
        <Title>Learn Anything</Title>{" "}
        <meta name="description" content="Learn Anything" />
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <GlobalStateProvider value={global}>
              <UserProvider value={user}>
                <WikiProvider value={wiki}>
                  <Routes>
                    <FileRoutes />
                  </Routes>
                </WikiProvider>
              </UserProvider>
            </GlobalStateProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
