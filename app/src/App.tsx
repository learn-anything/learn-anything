import { ui } from "@la/shared"
import { parseResponse } from "@la/shared/lib"
import { invoke } from "@tauri-apps/api/tauri"
import ShoSho from "shosho"
import * as solid from "solid-js"
import { isLoggedIn } from "../lib/lib"
import { useGlobalState } from "./GlobalContext/global"
import { useUser } from "./GlobalContext/user"
import { Monaco } from "./components/Monaco/Monaco"
import Settings from "./components/Settings"
import { FileTree } from "./file-tree"
import { useMobius } from "./root"

const Sidebar: solid.Component = () => {
  const user = useUser()

  return (
    <div class="h-full flex py-4 p-2 dark:bg-[#1e1e1e] bg-white flex-col justify-between items-center font-semibold">
      <div
        class="font-semibold hover:text-green-400 hover:opacity-90 transition-all cursor-pointer"
        onClick={() => {
          // TODO: show modal of settings like in obsidian
          // user.setMode("Settings")
        }}
      >
        <ui.Tooltip label="File Search">
          <ui.Icon name="FileSearch" />
        </ui.Tooltip>
      </div>
      <div class="p-1 px-2 rounded-md"></div>
      <div class="flex flex-col items-center gap-3">
        <div
          class="font-semibold hover:text-green-400 hover:opacity-90 transition-all cursor-pointer"
          onClick={() => {
            const loggedIn = isLoggedIn(global)
            console.log(loggedIn, "logged in")
          }}
        >
          <ui.Tooltip
            label={localStorage.getItem("hanko") ? "Profile" : "Sign In"}
          >
            <ui.Icon name="UserProfile" />
          </ui.Tooltip>
        </div>
        <div
          class="font-semibold hover:text-green-400 hover:opacity-90 transition-all cursor-pointer"
          onClick={() => {
            // TODO: show modal of settings like in obsidian
            user.setMode("Settings")
          }}
        >
          <ui.Tooltip label="Settings">
            <ui.Icon name="Settings" />
          </ui.Tooltip>
        </div>
      </div>
    </div>
  )
}

const PublishButton: solid.Component = () => {
  const global = useGlobalState()
  const mobius = useMobius()
  const [publishingState, setPublishingState] = solid.createSignal<
    null | string
  >(null)

  return (
    <ui.FancyButton
      onClick={async () => {
        const loggedIn = isLoggedIn(global)
        // TODO: publish current note to user's wiki
        if (loggedIn) {
          setPublishingState("publishing")
          const parts = global.state.currentlyOpenFile?.filePath.split("/")
          console.log(parts, "parts")
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
            relativePath = global.state.currentlyOpenFile.filePath.replace(
              global.state.localFolderPath,
              "",
            )
          }
          console.log(topicName)
          console.log(prettyName)
          // TODO: give ui to set it to true or false
          // for now set to true as no E2E yet or mobile
          const published = true
          console.log(global.state.currentlyOpenFile?.fileContent, "content")
          console.log(relativePath)

          const content = global.state.currentlyOpenFile?.fileContent!

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
          const [data] = parseResponse(res)
          if (data) {
            setPublishingState(null)
          }
        }
      }}
    >
      <solid.Show
        when={publishingState() === "publishing"}
        fallback={<>Publish</>}
      >
        Publishing...
      </solid.Show>
    </ui.FancyButton>
  )
}

export default function App() {
  const global = useGlobalState()
  const user = useUser()

  solid.onMount(() => {
    const shortcuts = new ShoSho({
      capture: true,
      target: document,
    })

    // search files in wiki
    // TODO: should focus on input
    shortcuts.register("Cmd+L", () => {
      if (global.state.showModal === "searchFiles") {
        global.set("showModal", "")
      } else {
        global.set("showModal", "searchFiles")
      }
    })
    shortcuts.start()
  })

  // TODO: CMD+L = search files/topics in wiki
  // there was some issue with CMD+L not triggering, fix
  // TODO: should these bindings be placed in this file? also they should be customisable
  // similar to https://x.com/fabiospampinato/status/1722729570573430979
  // TODO: probably switch to fabio's keybindings lib and wrap over it with solid
  // createShortcut(["Control", "L"], () => {
  // })

  const searchResults = solid.createMemo(() => {
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
    <div class="w-screen h-screen overflow-hidden  dark:bg-[#1e1e1e] bg-white">
      <div class="h-[2%] bg-white min-h-[28px] w-full dark:bg-[#1e1e1e] border-b border-slate-400 border-opacity-20"></div>

      <div class="h-[97%]">
        <solid.Show
          when={global.state.localFolderPath}
          fallback={
            <div class="w-full h-full flex justify-center items-center flex-col gap-5">
              <div>
                <ui.FancyButton
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
                </ui.FancyButton>
              </div>
            </div>
          }
        >
          <div class="absolute bottom-4 right-4 text-lg z-50">
            <PublishButton />
          </div>

          <div class="w-full h-full flex items-stretch justify-stretch">
            <div class="border-r-2 border-slate-400 border-opacity-20">
              <Sidebar />
            </div>
            <div class="border-r-2 border-slate-400 border-opacity-20">
              <FileTree />
            </div>
            {/* TODO: commented out codemirror as it was giving issues */}
            {/* such as, line wrapping: https://discuss.codemirror.net/t/linewrapping-true-fails-with-ts-error-and-does-not-work/7408/5 */}
            {/* and styling cursor to white in dark theme failed: https://discuss.codemirror.net/t/codemirror-cursor-class-does-not-work-in-safari/7409/3 */}
            {/* if it can be resolved, codemirror can be considered for use again */}
            {/* <CodemirrorEditor /> */}

            {/* monaco editor is chosen instead until then, it might be a better option in long term too as its used by vscode */}
            {/* and can be styled/tuned to achieve all the tasks we need */}
            {/* in LA we should be able to edit code inline in some code blocks with LSP support perhaps in some instances, monaco can allow this */}
            <div class="grow">
              <Monaco />
            </div>
          </div>
        </solid.Show>
      </div>

      <solid.Show when={user.user.mode === "Settings"}>
        <ui.Modal
          onClose={() => {
            user.setMode("Default")
          }}
        >
          <Settings />
        </ui.Modal>
      </solid.Show>

      <solid.Show when={global.state.showModal === "searchFiles"}>
        <ui.Modal
          onClose={() => {
            global.set("showModal", "")
          }}
        >
          {/* TODO: focus on input */}
          <div class="w-[700px]">
            <ui.Search placeholder={""} state={search_state} />
          </div>
        </ui.Modal>
        {/* <SearchModal
              items={wiki.wiki.topics}
              action={() => {}}
              searchPlaceholder="Search Topics"
            /> */}
      </solid.Show>
    </div>
  )
}
