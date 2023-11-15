import { ui } from "@la/shared"
import { FancyButton } from "@la/shared/ui"
import { invoke } from "@tauri-apps/api/tauri"
import { Show } from "solid-js"
import { isLoggedIn } from "../lib/lib"
import { useGlobalState } from "./GlobalContext/global"
import { useUser } from "./GlobalContext/user"
import { useWiki } from "./GlobalContext/wiki"
import { Monaco } from "./components/Monaco/Monaco"
import SearchModal from "./components/SearchModal"
import Settings from "./components/Settings"
import Sidebar from "./components/Sidebar"
import { useMobius } from "./root"

export default function App() {
  const global = useGlobalState()
  const user = useUser()
  const wiki = useWiki()
  const mobius = useMobius()

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

  return (
    <>
      <div class="flex flex-col " style={{ width: "100vw", height: "100vh" }}>
        <Show when={user.user.mode === "Settings"}>
          <ui.Modal
            onClose={() => {
              user.setMode("Default")
            }}
          >
            <Settings />
          </ui.Modal>
        </Show>
        <div class="flex h-full items-center dark:bg-[#1e1e1e] bg-white grow">
          <Show when={global.state.localFolderPath}>
            <Sidebar />
          </Show>
          <Show
            when={
              global.state.localFolderPath && global.state.currentlyOpenFile
            }
          >
            <div class="h-full overflow-auto w-full">
              <div class="absolute bottom-1 right-1 py-2 px-4 text-lg z-50">
                <FancyButton
                  onClick={async () => {
                    const loggedIn = isLoggedIn(global)
                    // TODO: publish current note to user's wiki
                    if (loggedIn) {
                      // await mobius().mutate({})
                      // const res = await mobius().query({
                      //   getGlobalTopic: {
                      //     where: {
                      //       topicName: "physics",
                      //     },
                      //     select: {
                      //       learningStatus: true,
                      //       likedLinkIds: true,
                      //       completedLinkIds: true,
                      //     },
                      //   },
                      //   getNotesForGlobalTopic: {
                      //     where: {
                      //       topicName: "physics",
                      //     },
                      //     select: {
                      //       content: true,
                      //       url: true,
                      //     },
                      //   },
                      // })
                      // // @ts-ignore
                      // const topicData = res.data.getGlobalTopic
                      // // @ts-ignore
                      // const notesData = res.data.getNotesForGlobalTopic
                      // console.log(topicData, "data")
                      // setGlobalTopic({
                      //   learningStatus: topicData.learningStatus,
                      //   likedLinkIds: topicData.likedLinkIds,
                      //   completedLinkIds: topicData.completedLinkIds,
                      //   notes: notesData,
                      // })
                    }
                  }}
                >
                  Publish
                </FancyButton>
              </div>
              {/* TODO: commented out codemirror as it was giving issues */}
              {/* such as, line wrapping: https://discuss.codemirror.net/t/linewrapping-true-fails-with-ts-error-and-does-not-work/7408/5 */}
              {/* and styling cursor to white in dark theme failed: https://discuss.codemirror.net/t/codemirror-cursor-class-does-not-work-in-safari/7409/3 */}
              {/* if it can be resolved, codemirror can be considered for use again */}
              {/* <CodemirrorEditor /> */}

              {/* monaco editor is chosen instead until then, it might be a better option in long term too as its used by vscode */}
              {/* and can be styled/tuned to achieve all the tasks we need */}
              {/* in LA we should be able to edit code inline in some code blocks with LSP support perhaps in some instances, monaco can allow this */}
              <Monaco />
            </div>
          </Show>

          <Show
            when={
              !global.state.localFolderPath &&
              localStorage.getItem("localFolderPath") === null
            }
          >
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
        </div>
      </div>
    </>
  )
}
