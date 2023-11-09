import { invoke } from "@tauri-apps/api/tauri"
import { Show, Suspense } from "solid-js"
import {
  File,
  GlobalStateProvider,
  createGlobalState,
} from "./GlobalContext/global"
import { UserProvider, createUserState } from "./GlobalContext/user"
import createWikiState, { WikiProvider } from "./GlobalContext/wiki"
import { CodemirrorEditor } from "./components/Codemirror/CodemirrorEditor"
import FancyButton from "./components/FancyButton"
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
                <div>
                  <div class="h-[25px]"></div>
                </div>
                <div class="flex items-center dark:bg-[#1e1e1e] bg-white grow">
                  <Show when={global.state.localFolderPath}>
                    <Sidebar />
                  </Show>
                  <Show when={global.state.localFolderPath}>
                    <div class="h-screen">
                      <CodemirrorEditor />
                    </div>
                  </Show>

                  <Show when={!global.state.localFolderPath}>
                    <div class="w-full h-full flex justify-center items-center flex-col gap-5">
                      <FancyButton
                        onClick={async () => {
                          console.log("runs...")
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
