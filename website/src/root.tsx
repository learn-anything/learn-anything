// @refresh reload
import { Suspense } from "solid-js"
import {
  useLocation,
  A,
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
import createTopicState, { TopicProvider } from "./GlobalContext/topic"
import createEditGuideState, {
  EditGuideProvider,
} from "./GlobalContext/edit-guide"
import { UserProvider, createUserState } from "./GlobalContext/user"

export default function Root() {
  const user = createUserState()
  const topic = createTopicState()
  const editGuide = createEditGuideState()

  const location = useLocation()
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600"
  return (
    <Html lang="en">
      <Head>
        <Title>Learn Anything</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <UserProvider value={user}>
              <TopicProvider value={topic}>
                <EditGuideProvider value={editGuide}>
                  <Routes>
                    <FileRoutes />
                  </Routes>
                </EditGuideProvider>
              </TopicProvider>
            </UserProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
