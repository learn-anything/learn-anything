// @refresh reload
// @ts-ignore
import { MatchFilters } from "@solidjs/router/dist/types"
import { DragDropProvider, DragDropSensors } from "@thisbeyond/solid-dnd"
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
import createEditGuide, { EditGuideProvider } from "./GlobalContext/edit-guide"

// TODO: https://github.com/nikitavoloboev/la-issues/issues/54 (should stop having to manually update this schema )
export const typeDefs = `
"""
De-prioritizes a fragment, causing the fragment to be omitted in the initial response and delivered as a subsequent response afterward.
"""
directive @defer(
  """When true fragment may be deferred"""
  if: Boolean! = true

  """
  This label should be used by GraphQL clients to identify the data from patch responses and associate it with the correct fragment.
  """
  label: String
) on INLINE_FRAGMENT | FRAGMENT_SPREAD

"""Directs the executor to return values as a Streaming response."""
directive @live on QUERY

"""Indicates that an input object is a oneOf input object"""
directive @oneOf on INPUT_OBJECT

type GlobalLink {
  id: String!
  title: String!
  url: String!
  year: String
}

type Mutation {
  createUser(email: String!): String!
}

type Query {
  publicGetGlobalTopics: [publicGetGlobalTopicsOutput!]!
  publicGetGlobalTopic(topicName: String!): publicGetGlobalTopicOutput!
  getGlobalLink(linkId: String!): publicGetGlobalLinkOutput!
  getGlobalLinks: [publicGetGlobalLinksOutput!]!
  checkForGlobalLink(linkUrl: String!): publicCheckForGlobalLinkOutput!
  stripe(plan: String!): String!
}

type globalGuideSection {
  title: String!
  links: [GlobalLink!]!
}

type latestGlobalGuide {
  summary: String!
  sections: [globalGuideSection!]!
}

type publicCheckForGlobalLinkOutput {
  url: String!
  title: String!
  year: Int
  description: String
}

type publicGetGlobalLinkOutput {
  title: String!
  url: String!
  verified: Boolean!
  public: Boolean!
  protocol: String
  fullUrl: String
  mainTopicAsString: String
  description: String
  urlTitle: String
  year: String
}

type publicGetGlobalLinksOutput {
  id: String!
  title: String!
  url: String!
}

type publicGetGlobalTopicOutput {
  prettyName: String!
  topicSummary: String!
  topicPath: String
  latestGlobalGuide: latestGlobalGuide
  links: [GlobalLink!]!
}

type publicGetGlobalTopicsOutput {
  prettyName: String!
  name: String!
}
`

export function createMobius(options: { hankoCookie: () => string }) {
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

export type MobiusType = ReturnType<typeof createMobius>

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
  const editGuide = createEditGuide()

  const filters: MatchFilters = {
    username: /^@.+/,
  }

  const [hankoCookie, setHankoCookie] = createSignal(getHankoCookie())

  const mobius = createMobius({
    hankoCookie,
  })
  const global = createGlobalState(mobius)
  const globalTopic = createGlobalTopic(mobius)

  return (
    <Html lang="en">
      <Head>
        <Title>Learn Anything</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      ></link>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <SignInCtx.Provider value={setHankoCookie}>
              <MobiusCtx.Provider value={mobius}>
                <UserProvider value={user}>
                  <GlobalStateProvider value={global}>
                    <GlobalTopicProvider value={globalTopic}>
                      <EditGuideProvider value={editGuide}>
                        {/* TODO: should probably move it from here as drag/drop is currently only done in /global-topic/edit */}
                        <DragDropProvider>
                          <DragDropSensors>
                            <Routes>
                              <Route
                                path="/:username"
                                component={UserProfile}
                                matchFilters={filters}
                              />
                              <FileRoutes />
                            </Routes>
                          </DragDropSensors>
                        </DragDropProvider>
                      </EditGuideProvider>
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
