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
  Title
} from "solid-start"
import { getHankoCookie } from "../lib/auth"
import { GlobalStateProvider, createGlobalState } from "./GlobalContext/global"
import createGlobalTopic, {
  GlobalTopicProvider
} from "./GlobalContext/global-topic"
import { UserProvider, createUserState } from "./GlobalContext/user"
import "./root.css"
import UserProfile from "./routes/@(username)"

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

"""Indicates that an input object is a oneOf input object"""
directive @oneOf on INPUT_OBJECT

type GlobalLink {
  id: String!
  title: String!
  url: String!
  protocol: String!
  year: String
  description: String
}

type LikedLink {
  id: String!
  title: String!
  url: String!
}

type Mutation {
  createUser(email: String!): String!
  updateTopicLearningStatus(learningStatus: learningStatus!, topicName: String!, verifiedTopic: Boolean!): String!
  updateLinkStatusResolver(linkId: String!, action: linkAction!): String!
  updateGlobalLinkStatus(action: globalLinkAction!, globalLinkId: String!): String!
  addPersonalLink(title: String!, url: String!, description: String): String!
  internalUpdateMemberUntilOfUser(email: String!, memberUntilDateInUnixTime: Int!): String!
  internalUpdateGrafbaseKv(topicsWithConnections: [updateGrafbaseKvOutput!]!): String!
  internalUpdateLatestGlobalGuide(topicName: String!, topicSummary: String!, sections: [section!]!): String!
  internalAddGlobalLinkToSection(linkUrl: String!, topicName: String!, sectionName: String!): String!
}

type PersonalLink {
  id: String!
  title: String!
  url: String!
}

type Query {
  publicGetTopicsWithConnections: [publicGetTopicsWithConnectionsOutput!]!
  publicGetGlobalTopics: [publicGetGlobalTopicsOutput!]!
  publicGetGlobalTopic(topicName: String!): publicGetGlobalTopicOutput!
  getUserDetails: getUserDetailsOutput!
  getNotesForGlobalTopic(topicName: String!): [globalNote!]!
  getLikedLinks: outputOfGetLikedLinks!
  getTopicsLearned: getTopicsLearnedOutput!
  getGlobalLink(linkId: String!): publicGetGlobalLinkOutput!
  getGlobalTopic(topicName: String!): getGlobalTopicOutput!
  getGlobalTopicLearningStatus(topicName: String!): String!
  getGlobalLinks: getGlobalLinksOutput!
  checkForGlobalLink(linkUrl: String!): publicCheckForGlobalLinkOutput!
  stripe(plan: String!, userEmail: String!): String!
}

type getGlobalLinksOutput {
  id: String!
  title: String!
  url: String!
}

type getGlobalTopicOutput {
  learningStatus: learningStatus!
  likedLinkIds: [String!]!
  completedLinkIds: [String!]!
}

type getTopicsLearnedOutput {
  topicsToLearn: [topicToLearn!]!
  topicsLearning: [topicToLearn!]!
  topicsLearned: [topicToLearn!]!
}

type getUserDetailsOutput {
  isMember: Boolean!
}

type globalGuideSection {
  title: String!
  summary: String
  links: [GlobalLink!]!
}

enum globalLinkAction {
  like
  unlike
  complete
  uncomplete
}

type globalNote {
  content: String!
  url: String
}

type latestGlobalGuide {
  summary: String!
  sections: [globalGuideSection!]!
}

enum learningStatus {
  to_learn
  learning
  learned
  none
}

enum linkAction {
  like
  unlike
  complete
  uncomplete
}

type outputOfGetLikedLinks {
  likedLinks: [LikedLink!]!
  personalLinks: [PersonalLink!]!
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
  description: String
  urlTitle: String
  year: String
}

type publicGetGlobalTopicOutput {
  prettyName: String!
  topicSummary: String!
  latestGlobalGuide: latestGlobalGuide
  links: [GlobalLink!]!
  notesCount: Int!
}

type publicGetGlobalTopicsOutput {
  prettyName: String!
  name: String!
}

type publicGetTopicsWithConnectionsOutput {
  name: String!
  prettyName: String!
  connections: [String!]!
}

input section {
  title: String!
  summary: String
  linkIds: [String!]!
}

type topicToLearn {
  name: String!
  prettyName: String!
  verified: Boolean!
}

input updateGrafbaseKvOutput {
  name: String!
  prettyName: String!
  connections: [String!]!
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
          Authorization: `Bearer ${hankoCookie()}`
        },
        body: JSON.stringify({
          query,
          variables: {}
        })
      }).then((res) => res.json())
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
  const filters: MatchFilters = {
    username: /^@.+/
  }

  const [hankoCookie, setHankoCookie] = createSignal(getHankoCookie())

  const mobius = createMobius({
    hankoCookie
  })
  const user = createUserState(mobius)
  const global = createGlobalState(mobius)
  const globalTopic = createGlobalTopic(mobius, user, global)

  return (
    <Html lang="en">
      <Head>
        <Title>Learn Anything</Title>
        <Meta
          name="description"
          content="Organize world's knowledge, explore connections and curate learning paths"
        />
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
