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
  Route,
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
import { MatchFilters } from "@solidjs/router/dist/types"
// import Topic from "./routes/(topic)"
// import Topic from "./routes/(topic)"

function UserProfile() {
  return <div>user profile</div>
}

export default function Root() {
  const user = createUserState()
  const topic = createTopicState()
  const editGuide = createEditGuideState()

  const filters: MatchFilters = {
    username: /^@.+/,
  }

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
                    <Route
                      path="/@:username"
                      component={UserProfile}
                      matchFilters={filters}
                    />
                    {/* <Route
                      path="/:topic"
                      component={Topic}
                      matchFilters={filters}
                    />
                    <Route
                      path="/:username/:topic"
                      component={Topic}
                      matchFilters={filters}
                    /> */}
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
