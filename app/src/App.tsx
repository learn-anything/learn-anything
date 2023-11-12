import { FancyButton, ModalWithMessageAndButton } from "@la/shared/ui"
import { listen } from "@tauri-apps/api/event"
import { open } from "@tauri-apps/api/shell"
import { invoke } from "@tauri-apps/api/tauri"
import { Show, onMount } from "solid-js"
import { useGlobalState } from "./GlobalContext/global"
import { useUser } from "./GlobalContext/user"
import { useWiki } from "./GlobalContext/wiki"
import { CodemirrorEditor } from "./components/Codemirror/CodemirrorEditor"
import SearchModal from "./components/SearchModal"
import Sidebar from "./components/Sidebar"
import { isLoggedIn } from "../lib/lib"

export default function App() {
  const global = useGlobalState()
  const user = useUser()
  const wiki = useWiki()

  // TODO: CMD+L = search files/topics in wiki
  // there was some issue with CMD+L not triggering, fix
  // TODO: should these bindings be placed in this file? also they should be customisable
  // similar to https://x.com/fabiospampinato/status/1722729570573430979
  // createShortcut(["Control", "L"], () => {
  //   if (user.user.mode === "Search Topics") {
  //     user.setMode("Default")
  //   } else {
  //     user.setMode("Search Topics")
  //   }
  // })

  // starts a listner for signed-in-token event (used for authentication)
  onMount(async () => {
    await listen<[path: string, params: any]>("signed-in-token", (event) => {
      const [path, params] = event.payload
      if (path === "/login") {
        // TODO: store in sqlite instead!
        // due to: Localstorage is not a guarantee that you have absolute persistence And the OS can always decide to prune ANY localstorage, and even cookies
        const hankoToken = params.hankoToken
        localStorage.setItem("hanko", hankoToken)
        global.set("showModal", "")
      }
    })
  })

  return (
    <>
      <div class="flex flex-col" style={{ width: "100vw", height: "100vh" }}>
        <div class="flex h-full items-center dark:bg-[#1e1e1e] bg-white grow">
          <Show when={global.state.localFolderPath}>
            <Sidebar />
          </Show>
          <Show
            when={
              global.state.localFolderPath && global.state.currentlyOpenFile
            }
          >
            <div class="h-full overflow-auto">
              <div class="absolute bottom-1 right-1 py-2 px-4 text-lg">
                <FancyButton
                  onClick={async () => {
                    const loggedIn = isLoggedIn()
                    console.log(loggedIn, "logged in")
                  }}
                >
                  Publish
                </FancyButton>
              </div>
              <CodemirrorEditor />
            </div>
          </Show>

          <Show when={!global.state.localFolderPath}>
            <div class="w-full h-full flex justify-center items-center flex-col gap-5">
              <div>
                <FancyButton
                  onClick={async () => {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                    const connectedFolder = (await invoke("connect_folder", {
                      command: {},
                    })) as [string, File[]] | null
                    if (connectedFolder !== null) {
                      global.set("localFolderPath", connectedFolder[0])
                      // @ts-ignore
                      global.set("files", connectedFolder[1])
                    }
                  }}
                >
                  Connect folder
                </FancyButton>
              </div>
            </div>
          </Show>

          <Show when={user.user.mode === "Search Topics"}>
            <SearchModal
              items={wiki.wiki.topics}
              action={() => {}}
              searchPlaceholder="Search Topics"
            />
          </Show>
          <Show when={global.state.showModal === "needToLoginInstructions"}>
            <ModalWithMessageAndButton
              // TODO: maybe have submessage? or have `message` accept solid JSX so you can have paragraphs?
              message={
                "Press the button below to login with browser. If you're already logged in to learn-anything.xyz, it will automatically redirect you to desktop. You might need to accept a pop up window to go back to desktop. If not logged in, you will need to login in browser first then it will prompt you to go back."
              }
              buttonText="Login"
              buttonAction={async () => {
                await open(import.meta.env.VITE_LA_DESKTOP_SIGNIN_URL)
              }}
              onClose={() => {
                global.set("showModal", "")
              }}
            />
          </Show>
        </div>
      </div>
    </>
  )
}
