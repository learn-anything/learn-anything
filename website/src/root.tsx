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
import { GlobalStateProvider, createGlobalState } from "./GlobalContext/global"
import createGlobalTopic, {
  GlobalTopicProvider,
} from "./GlobalContext/global-topic"
import { UserProvider, createUserState } from "./GlobalContext/user"
import "./root.css"
import UserProfile from "./routes/@(username)"
import { getHankoCookie } from "../lib/auth"

// TODO: https://github.com/nikitavoloboev/la-issues/issues/54 (should stop having to manually update this schema )
const typeDefs = `
  """Directs the executor to return values as a Streaming response."""
  directive @live on QUERY

  """Indicates that an input object is a oneOf input object"""
  directive @oneOf on INPUT_OBJECT

  type Mutation {
    createUser(email: String!): String!
    updateGlobalTopic(input: inputToUpdateGlobalTopic!): String!
  }

  type Query {
    publicGetGlobalTopics: [outputOfPublicGetGlobalTopics!]!
    publicGetGlobalTopic(topicName: String!): publicGlobalTopic!
    getGlobalTopic(topicName: String!): globalTopic!
    stripe(plan: String!): String!
  }

  type globalTopic {
    name: String!
    prettyName: String!
    topicSummary: String!
    learningStatus: learningStatus
  }

  input inputToUpdateGlobalTopic {
    topicSummary: String!
    sections: [section!]!
  }

  enum learningStatus {
    to_learn
    learning
  }

  input link {
    title: String!
    url: String!
    author: String
    year: Int
    completed: Boolean
    addedByUser: Boolean
  }

  type outputOfPublicGetGlobalTopics {
    prettyName: String!
    name: String!
  }

  type publicGlobalTopic {
    prettyName: String!
    topicSummary: String!
  }

  input section {
    title: String!
    links: [link!]!
  }
`

function createMobius(options: { hankoCookie: () => string }) {
  const { hankoCookie } = options

  const mobius = new Mobius<typeof typeDefs>({
    fetch: (query) =>
      fetch(import.meta.env.VITE_GRAFBASE_API_URL, {
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
  const global = createGlobalState()
  const globalTopic = createGlobalTopic()

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
                  <GlobalStateProvider value={global}>
                    <GlobalTopicProvider value={globalTopic}>
                      <Routes>
                        <Route
                          path="/:username"
                          component={UserProfile}
                          matchFilters={filters}
                        />
                        <FileRoutes />
                      </Routes>
                    </GlobalTopicProvider>
                  </GlobalStateProvider>
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
