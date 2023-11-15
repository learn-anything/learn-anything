import { ui } from "@la/shared"
import { FancyButton, Modal } from "@la/shared/ui"
import { createShortcut } from "@solid-primitives/keyboard"
import { invoke } from "@tauri-apps/api/tauri"
import { Show, createMemo, createSignal } from "solid-js"
import { isLoggedIn } from "../lib/lib"
import { useGlobalState } from "./GlobalContext/global"
import { useUser } from "./GlobalContext/user"
import { Monaco } from "./components/Monaco/Monaco"
import Settings from "./components/Settings"
import Sidebar from "./components/Sidebar"
import { useMobius } from "./root"

export default function App() {
  const global = useGlobalState()
  const user = useUser()
  // const wiki = useWiki()
  const mobius = useMobius()
  const [publishingState, setPublishingState] = createSignal<null | string>(
    null,
  )

  // TODO: CMD+L = search files/topics in wiki
  // there was some issue with CMD+L not triggering, fix
  // TODO: should these bindings be placed in this file? also they should be customisable
  // similar to https://x.com/fabiospampinato/status/1722729570573430979
  // TODO: probably switch to fabio's keybindings lib and wrap over it with solid
  createShortcut(["Control", "L"], () => {
    if (global.state.showModal === "searchFiles") {
      global.set("showModal", "")
    } else {
      global.set("showModal", "searchFiles")
    }
  })

  const searchResults = createMemo(() => {
    return global.state.files.map((f) => ({
      name: f.filePath,
    }))
  })

  const search_state = ui.createSearchState({
    searchResults,
    onSelect: ({ name }) => {
      console.log(name, "name")
      // const foundTopic = global.state.topicsWithConnections.find(
      //   (t) => t.prettyName === name,
      // )!
      // navigate(`/${foundTopic.name}`)
      // logUntracked("Topic searched", search_state.query)
    },
  })

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
          <Show
            when={global.state.localFolderPath}
            fallback={
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
            }
          >
            <Sidebar />
            <div class="h-full overflow-auto w-full">
              <div class="absolute bottom-1 right-1 py-2 px-4 text-lg z-50">
                <FancyButton
                  onClick={async () => {
                    const loggedIn = isLoggedIn(global)
                    // TODO: publish current note to user's wiki
                    if (loggedIn) {
                      setPublishingState("publishing")
                      const parts =
                        global.state.currentlyOpenFile?.filePath.split("/")
                      // TODO: not sure how to avoid ts-ignore nicely here
                      // @ts-ignore
                      const fileName = parts[parts.length - 1]
                      // @ts-ignore
                      const topicName = fileName.split(".")[0]
                      const prettyName =
                        // @ts-ignore
                        topicName.charAt(0).toUpperCase() +
                        // @ts-ignore
                        topicName.slice(1).replace(/-/g, " ")
                      let relativePath = ""
                      if (
                        global.state.currentlyOpenFile?.filePath &&
                        global.state.localFolderPath
                      ) {
                        relativePath =
                          global.state.currentlyOpenFile.filePath.replace(
                            global.state.localFolderPath,
                            "",
                          )
                      }
                      console.log(topicName)
                      console.log(prettyName)
                      // TODO: give ui to set it to true or false
                      // for now set to true as no E2E yet or mobile
                      const published = true
                      console.log(
                        global.state.currentlyOpenFile?.fileContent,
                        "content",
                      )
                      console.log(relativePath)

                      const content =
                        global.state.currentlyOpenFile?.fileContent!

                      // doing this as edgedb when taking a string with new lines
                      // save it strangely without `\n`, hard to see where new lines are this way
                      // this solves this, probably better way to do this
                      const cleanContent = content.replace(/\n/g, "<br>")
                      // console.log(cleanContent, "clean")

                      const res = await mobius().mutate({
                        updateTopicOfWiki: {
                          where: {
                            topicName: topicName!,
                            prettyName: prettyName,
                            published: published,
                            content: cleanContent,
                            topicPath: relativePath,
                          },
                          select: true,
                        },
                      })
                      console.log(res, "res")
                      setPublishingState(null)
                    }
                  }}
                >
                  <Show
                    when={publishingState() === "publishing"}
                    fallback={<>Publish</>}
                  >
                    Publishing...
                  </Show>
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

          <Show when={global.state.showModal === "searchFiles"}>
            <Modal
              onClose={() => {
                global.set("showModal", "")
              }}
            >
              {/* TODO: focus on input */}
              <ui.Search placeholder={""} state={search_state} />
            </Modal>
            {/* <SearchModal
              items={wiki.wiki.topics}
              action={() => {}}
              searchPlaceholder="Search Topics"
            /> */}
          </Show>
        </div>
      </div>
    </>
  )
}
