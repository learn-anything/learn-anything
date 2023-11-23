// @refresh reload
// @ts-ignore
import { getHankoCookie, grafbaseTypeDefs } from "@la/shared/lib"
import { DragDropProvider, DragDropSensors } from "@thisbeyond/solid-dnd"
import Mobius from "graphql-mobius"
import {
  Show,
  Suspense,
  createContext,
  createSignal,
  useContext
} from "solid-js"
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
  useNavigate
} from "solid-start"
import { GlobalStateProvider, createGlobalState } from "./GlobalContext/global"
import createGlobalTopic, {
  GlobalTopicProvider
} from "./GlobalContext/global-topic"
import { UserProvider, createUserState } from "./GlobalContext/user"
import "./root.css"
import UserProfile from "./routes/@(username)"
import PersonalTopic from "./routes/@(username)/[topic]"
import * as solid_styled from "solid-styled"
import { useAssets } from "solid-js/web"
import { Modal, ModalWithMessageAndButton } from "@la/shared/ui"

export function createMobius(options: { hankoCookie: () => string }) {
  const { hankoCookie } = options

  const mobius = new Mobius<typeof grafbaseTypeDefs>({
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
  // TODO: no idea where MatchFilters is.. https://github.com/solidjs/solid-router#dynamic-routes
  const filters: any = {
    username: /^@.+/
  }
  const navigate = useNavigate()

  const [hankoCookie, setHankoCookie] = createSignal(getHankoCookie())

  const mobius = createMobius({
    hankoCookie
  })
  const user = createUserState(mobius)
  const global = createGlobalState(mobius)
  const globalTopic = createGlobalTopic(mobius, user, global)

  const sheets: solid_styled.StyleData[] = []
  useAssets(() => solid_styled.renderSheets(sheets))

  return (
    <solid_styled.StyleRegistry styles={sheets}>
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
                              <Route
                                path="/:username/:topic"
                                component={PersonalTopic}
                              />
                              <FileRoutes />
                            </Routes>
                            <Show
                              when={
                                global.state.showModal === "out-of-free-actions"
                              }
                            >
                              <ModalWithMessageAndButton
                                message={
                                  "You run out of free actions. Please become a member for unlimited access."
                                }
                                buttonText="Become Member"
                                buttonAction={async () => {
                                  global.set("showModal", "")
                                  navigate("/pricing")
                                }}
                                onClose={() => {
                                  global.set("showModal", "")
                                }}
                              />
                            </Show>
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
    </solid_styled.StyleRegistry>
  )
}
