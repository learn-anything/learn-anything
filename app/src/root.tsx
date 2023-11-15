import { watch, watchImmediate } from "tauri-plugin-fs-watch-api"
import {
  Suspense,
  createContext,
  ErrorBoundary,
  createSignal,
  useContext,
  onMount,
  createMemo,
  Show,
  createEffect,
} from "solid-js"
import Mobius from "graphql-mobius"
import App from "./App"
import { GlobalStateProvider, createGlobalState } from "./GlobalContext/global"
import { UserProvider, createUserState } from "./GlobalContext/user"
import createWikiState, { WikiProvider } from "./GlobalContext/wiki"
import { grafbaseTypeDefs } from "@la/shared/lib"
import { listen } from "@tauri-apps/api/event"
import { ModalWithMessageAndButton } from "@la/shared/ui"
import { invoke } from "@tauri-apps/api/tauri"

export function createMobius(options: { hankoCookie: () => string }) {
  const { hankoCookie } = options

  const mobius = createMemo(() => {
    return new Mobius<typeof grafbaseTypeDefs>({
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
  })
  return mobius
}

export type MobiusType = ReturnType<typeof createMobius>

const MobiusCtx = createContext({} as ReturnType<typeof createMobius>)

export function useMobius() {
  return useContext(MobiusCtx)
}

export default function Root() {
  const [hankoCookie, setHankoCookie] = createSignal(
    localStorage.getItem("hanko") ?? "",
  )

  const mobius = createMobius({
    hankoCookie,
  })

  const global = createGlobalState()
  const user = createUserState()
  const wiki = createWikiState()

  // starts a listener for signed-in-token event (used for authentication)
  onMount(async () => {
    await listen<[path: string, params: any]>("signed-in-token", (event) => {
      const [path, params] = event.payload
      if (path === "/login") {
        // TODO: store in sqlite instead!
        // due to: Localstorage is not a guarantee that you have absolute persistence And the OS can always decide to prune ANY localstorage, and even cookies
        const hankoToken = params.hankoToken
        localStorage.setItem("hanko", hankoToken)
        setHankoCookie(params.hankoToken)
        global.set("showModal", "")
      }
    })
  })

  // start listening to all files inside connected folder for changes
  createEffect(async () => {
    if (global.state.localFolderPath) {
      const stopWatching = await watch(
        global.state.localFolderPath,
        async (event) => {
          // @ts-ignore
          const path = event[0].path
          // console.log(path, "path")
          if (path) {
            const fileContent = await invoke("read_file_content", { path })
            // console.log(fileContent, "file content")
            let filePath = path.replace(global.state.localFolderPath, "")
            console.log(filePath, "file path")
            global.set("currentlyOpenFile", {
              filePath: filePath,
              fileContent: fileContent as string,
            })
          }
        },
        { recursive: true },
      )
    }
    // TODO: use stopWatching to unsubscribe to old watcher when local folder path changes
    // and subscribe to new folder
  })

  return (
    <>
      <Suspense>
        <ErrorBoundary
          fallback={(err) => {
            return <div>{JSON.stringify(err)}</div>
          }}
        >
          <GlobalStateProvider value={global}>
            <MobiusCtx.Provider value={mobius}>
              <UserProvider value={user}>
                <WikiProvider value={wiki}>
                  {/* TODO: should solid router be used here just like in website? */}
                  <App />
                </WikiProvider>
              </UserProvider>
            </MobiusCtx.Provider>
          </GlobalStateProvider>
        </ErrorBoundary>
        <Show when={global.state.showModal === "needToLoginInstructions"}>
          <ModalWithMessageAndButton
            // TODO: maybe have submessage? or have `message` accept solid JSX so you can have paragraphs?
            message={
              "Press the button below to login with browser. If you're already logged in to learn-anything.xyz, it will automatically redirect you to desktop. You might need to accept a pop up window to go back to desktop. If not logged in, you will need to login in browser first then it will prompt you to go back."
            }
            buttonText="Login"
            buttonAction={async () => {
              if (import.meta.env.VITE_LOCAL) {
                localStorage.setItem("hanko", import.meta.env.VITE_HANKO_TOKEN)
                setHankoCookie(import.meta.env.VITE_HANKO_TOKEN)
                return
              }
              await open(import.meta.env.VITE_LA_DESKTOP_SIGNIN_URL)
            }}
            onClose={() => {
              global.set("showModal", "")
            }}
          />
        </Show>
      </Suspense>
    </>
  )
}
