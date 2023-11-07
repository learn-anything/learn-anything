import { Show } from "solid-js"
import { useGlobalState } from "../GlobalContext/global"
import { useUser } from "../GlobalContext/user"
import { useWiki } from "../GlobalContext/wiki"
import FancyButton from "../components/FancyButton"
import NoTopicChosen from "../components/NoTopicChosen"
import SearchModal from "../components/SearchModal"
import Sidebar from "../components/Sidebar"
import { invoke } from "@tauri-apps/api/tauri"
import { File } from "../GlobalContext/global"

export default function App() {
  const user = useUser()
  const wiki = useWiki()
  const global = useGlobalState()

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
      <style>
        {`
      `}
      </style>
      <div class="flex flex-col" style={{ width: "100vw", height: "100vh" }}>
        <div>
          <div class="h-[25px]"></div>
        </div>
        <div class="flex items-center dark:bg-[#1e1e1e] bg-white grow">
          {/* <Show when={user.user.showSignIn}> */}
          {/* TODO: make a modal, pretty */}
          {/* TODO: try not to have 'pages', just have modals on top of the editor */}
          {/* <SignInPage /> */}
          {/* </Show> */}
          <Show when={global.state.localFolderPath}>
            <Sidebar />
          </Show>
          <Show
            when={wiki.wiki.openTopic.fileContent}
            fallback={<NoTopicChosen />}
          >
            {/* <Editor /> */}
            {/* <TiptapEditor /> */}
            {/* <CodemirrorEditor /> */}
          </Show>

          <Show when={!global.state.localFolderPath}>
            <div class="w-full h-full flex justify-center items-center flex-col gap-5">
              <FancyButton
                onClick={async () => {
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                  const connectedFolder = (await invoke("connect_folder", {
                    command: {},
                  })) as [string, File[]] | null
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

          {/* <Show
              when={!wiki.wiki.wikiFolderPath || user.user.mode === "Settings"}
            >
              <Settings />
            </Show> */}
          <Show when={user.user.mode === "Search Topics"}>
            <SearchModal
              items={wiki.wiki.topics}
              action={() => {}}
              searchPlaceholder="Search Topics"
            />
          </Show>
        </div>
      </div>
      {/* <Show when={import.meta.env.MODE === "development"}>
        <DevToolsPanel />
      </Show> */}
      {/* <Show when={user.user.mode === "New Note"}>
        <InputModal />
      </Show> */}
    </>
  )
}
