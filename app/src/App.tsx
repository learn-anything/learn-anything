import { listen } from "@tauri-apps/api/event"
import { invoke } from "@tauri-apps/api/tauri"
import { Show, Suspense, onMount } from "solid-js"
import {
  File,
  GlobalStateProvider,
  createGlobalState,
} from "./GlobalContext/global"
import { UserProvider, createUserState } from "./GlobalContext/user"
import createWikiState, { WikiProvider } from "./GlobalContext/wiki"
import { CodemirrorEditor } from "./components/Codemirror/CodemirrorEditor"
import { FancyButton } from "@la/shared/ui"
import SearchModal from "./components/SearchModal"
import Sidebar from "./components/Sidebar"

export default function App() {
  const user = createUserState()
  const wiki = createWikiState()
  const global = createGlobalState()

  // TODO: Meta + L gives problems
  // does not trigger most of the time
  // so control + .. is used instead
  // createShortcut(["Control", "L"], () => {
  //   if (user.user.mode === "Search Topics") {
  //     user.setMode("Default")
  //   } else {
  //     user.setMode("Search Topics")
  //   }
  // })

  // TODO: listen to deep links made to desktop app
  onMount(async () => {
    await listen<[path: string, params: any]>(
      "signed-in-token-and-email",
      (event) => {
        const [path, params] = event.payload
        console.log("Path:", path)
        console.log("Parameters:", params)
      },
    )
  })

  return (
    <>
      <Suspense>
        <GlobalStateProvider value={global}>
          <UserProvider value={user}>
            <WikiProvider value={wiki}>
              <div
                class="flex flex-col"
                style={{ width: "100vw", height: "100vh" }}
              >
                <div class="flex h-full items-center dark:bg-[#1e1e1e] bg-white grow">
                  <Show when={global.state.localFolderPath}>
                    <Sidebar />
                  </Show>
                  <Show
                    when={
                      global.state.localFolderPath &&
                      global.state.currentlyOpenFile
                    }
                  >
                    <div class="h-full">
                      <div class="absolute bottom-1 right-1 py-2 px-4 text-lg">
                        <FancyButton
                          onClick={() => {
                            // TODO: check if not logged in
                            window.open(
                              "https://learn-anything.xyz/desktop-login",
                              "_blank",
                            )
                          }}
                        >
                          Publish
                        </FancyButton>
                      </div>
                      {/* <CodemirrorEditor /> */}
                    </div>
                  </Show>

                  <Show when={!global.state.localFolderPath}>
                    <div class="w-full h-full flex justify-center items-center flex-col gap-5">
                      <FancyButton
                        onClick={async () => {
                          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                          const connectedFolder = (await invoke(
                            "connect_folder",
                            {
                              command: {},
                            },
                          )) as [string, File[]] | null
                          if (connectedFolder !== null) {
                            global.set("localFolderPath", connectedFolder[0])
                            global.set("files", connectedFolder[1])
                          }
                        }}
                      >
                        Connect folder
                      </FancyButton>
                    </div>
                  </Show>

                  <Show when={user.user.mode === "Search Topics"}>
                    <SearchModal
                      items={wiki.wiki.topics}
                      action={() => {}}
                      searchPlaceholder="Search Topics"
                    />
                  </Show>
                </div>
              </div>
            </WikiProvider>
          </UserProvider>
        </GlobalStateProvider>
      </Suspense>
    </>
  )
}
