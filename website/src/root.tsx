// @refresh reload
import { MatchFilters } from "@solidjs/router/dist/types"
import Mobius from "graphql-mobius"
import { Suspense, createContext, createSignal, useContext } from "solid-js"
import {
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
import createEditGuideState, {
  EditGuideProvider,
} from "./GlobalContext/edit-guide"
import createTopicState, { TopicProvider } from "./GlobalContext/topic"
import { UserProvider, createUserState } from "./GlobalContext/user"
import "./root.css"
import UserProfile from "./routes/@(username)"

// TODO: probably hanko front end sdk has function to do this
function getHankoCookie(): string {
  const allCookies = document.cookie
  const hankoCookie = allCookies
    .split(";")
    .find((cookie) => {
      return cookie
    })
    ?.split("=")[1]
  return hankoCookie ?? ""
}

const typeDefs = `
"""Directs the executor to return values as a Streaming response."""
directive @live on QUERY

"""Indicates that an input object is a oneOf input object"""
directive @oneOf on INPUT_OBJECT

type GlobalTopic {
  name: String!
  prettyName: String!
  topicSummary: String!
  learningStatus: learningStatus
}

type GlobalTopicPublic {
  name: String!
  prettyName: String!
  topicSummary: String!
}

type Query {
  GlobalTopicPublic(topicName: String!): GlobalTopicPublic!
  GlobalTopic(topicName: String!): GlobalTopic!
}

enum learningStatus {
  to_learn
  learning
}
`

function createMobius(options: { hankoCookie: () => string }) {
  const { hankoCookie } = options

  const mobius = new Mobius<typeof typeDefs>({
    fetch: (query) =>
      fetch("http://127.0.0.1:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${hankoCookie()}`,
        },
        body: JSON.stringify({
          query,
          variables: {},
        }),
      }).then((res) => res.json()),
  })

  return mobius
}

const MobiusCtx = createContext({} as ReturnType<typeof createMobius>)

export function useMobius() {
  return useContext(MobiusCtx)
}

const SignInCtx = createContext({} as (cookie: string) => void)

export function useSignIn() {
  return useContext(SignInCtx)
}

export default function Root() {
  const user = createUserState()
  const topic = createTopicState()
  const editGuide = createEditGuideState()

  const filters: MatchFilters = {
    username: /^@.+/,
  }

  const [hankoCookie, setHankoCookie] = createSignal(getHankoCookie())

  const mobius = createMobius({
    hankoCookie,
  })

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
            <SignInCtx.Provider value={setHankoCookie}>
              <MobiusCtx.Provider value={mobius}>
                <UserProvider value={user}>
                  <TopicProvider value={topic}>
                    <EditGuideProvider value={editGuide}>
                      <Routes>
                        <Route
                          path="/:username"
                          component={UserProfile}
                          matchFilters={filters}
                        />
                        <FileRoutes />
                      </Routes>
                    </EditGuideProvider>
                  </TopicProvider>
                </UserProvider>
              </MobiusCtx.Provider>
            </SignInCtx.Provider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
