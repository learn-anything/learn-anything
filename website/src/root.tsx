// @refresh reload
// @ts-ignore
import { getHankoCookie, grafbaseTypeDefs } from "@la/shared/lib"
import toast, { Toaster } from "solid-toast"
import { ModalWithMessageAndButton } from "@la/shared/ui"
import { DragDropProvider, DragDropSensors } from "@thisbeyond/solid-dnd"
import Mobius from "graphql-mobius"
import {
  Show,
  Suspense,
  createContext,
  createSignal,
  useContext
} from "solid-js"
import { useAssets } from "solid-js/web"
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
  useLocation,
  useNavigate
} from "solid-start"
import * as solid_styled from "solid-styled"
import { GlobalStateProvider, createGlobalState } from "./GlobalContext/global"
import createGlobalTopic, {
  GlobalTopicProvider
} from "./GlobalContext/global-topic"
import { UserProvider, createUserState } from "./GlobalContext/user"
import "./root.css"
import UserProfile from "./routes/@(username)"
import PersonalTopic from "./routes/@(username)/[topic]"

export function createMobius(
  options: { hankoCookie: () => string },
  onError: (error: string) => void
) {
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
      }).then(async (res) => {
        const respJson = await res.json()
        const errorMessage = respJson?.errors?.[0]?.message
        if (errorMessage) {
          onError(errorMessage)
        } else {
          return respJson
        }
      })
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
  const location = useLocation()

  const [hankoCookie, setHankoCookie] = createSignal(getHankoCookie())

  const onError = (error: string) => {
    if (location.pathname !== "/auth" && error.includes("Token expired")) {
      navigate("/auth")
    } else if (error.includes("cannot-update-topic-learning-status")) {
      global.set("showModal", "cannot-update-topic-learning-status")
    } else if (error.includes("cannot-update-global-link-status")) {
      global.set("showModal", "cannot-update-global-link-status")
    } else {
      toast.error(JSON.parse(error).message)
    }
  }
  const mobius = createMobius(
    {
      hankoCookie
    },
    onError
  )

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
                                global.state.showModal ===
                                "cannot-update-topic-learning-status"
                              }
                            >
                              <ModalWithMessageAndButton
                                message={
                                  "As non member, you can only track learning status of 10 topics."
                                }
                                buttonText="Become member for unlimited access"
                                buttonAction={async () => {
                                  global.set("showModal", "")
                                  navigate("/pricing")
                                }}
                                onClose={() => {
                                  global.set("showModal", "")
                                }}
                              />
                            </Show>
                            <Show
                              when={
                                global.state.showModal ===
                                "cannot-update-global-link-status"
                              }
                            >
                              <ModalWithMessageAndButton
                                message={
                                  "As non member, you can only track status of 10 external links."
                                }
                                buttonText="Become member for unlimited access"
                                buttonAction={async () => {
                                  global.set("showModal", "")
                                  navigate("/pricing")
                                }}
                                onClose={() => {
                                  global.set("showModal", "")
                                }}
                              />
                            </Show>
                            <Toaster />
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
