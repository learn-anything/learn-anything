import { For, Show, createMemo, createSignal } from "solid-js"
import { useGlobalState } from "../GlobalContext/global"
import { useUser } from "../GlobalContext/user"
import Icon from "./Icon"
import clsx from "clsx"
// @ts-ignore
import { Motion } from "@motionone/solid"
import Tooltip from "./Tooltip"

type TreeContent = TreeDirectory | TreeFile

type TreeDirectory = {
  type: "directory"
  name: string
  depth: number
  contents: TreeContent[]
}

type TreeFile = {
  type: "file"
  path: string
  name: string
  depth: number
}

const visitDir = (
  list: TreeContent[],
  parent: TreeDirectory,
  segments: string[],
  filepath: string,
  depth: number,
): void => {
  for (let i = depth; i < segments.length; i += 1) {
    const seg = segments[i]!
    // seg is directory
    if (i < segments.length - 1) {
      // dir found in parent
      for (const node of parent.contents) {
        if (node.type !== "directory" || node.name !== seg) continue
        visitDir(list, node, segments, filepath, i + 1)
        return
      }
      // dir not found - create new one
      const dir: TreeDirectory = {
        type: "directory",
        name: seg,
        contents: [],
        depth: depth,
      }
      parent.contents.push(dir)
      list.push(dir)
      visitDir(list, dir, segments, filepath, i + 1)
      return
    }
    // seg is file
    else {
      const file: TreeFile = {
        type: "file",
        name: seg.split(".")[0]!,
        depth: depth,
        path: filepath,
      }
      parent.contents.push(file)
      list.push(file)
    }
  }
}

const filepathsToTree = (
  filepaths: string[],
): [list: TreeContent[], root: TreeDirectory] => {
  const root: TreeDirectory = {
    type: "directory",
    name: "root",
    contents: [],
    depth: -1,
  }
  const list: TreeContent[] = []

  for (const path of filepaths) {
    const segments = path.split("/")
    visitDir(list, root, segments, path, 0)
  }

  return [list, root]
}

export default function Sidebar() {
  const user = useUser()
  const global = useGlobalState()

  const directoryTree = createMemo(() => {
    return filepathsToTree(global.state.files.map((f) => f.filePath))
  })

  const [collapsed, setCollapsed] = createSignal(new WeakSet<TreeContent>(), {
    equals: false,
  })

  const toggleCollapsed = (node: TreeContent) => {
    setCollapsed((set) => {
      set.delete(node) || set.add(node)
      return set
    })
  }

  const collapsedList = createMemo(() => {
    const collapsedList: TreeContent[] = []
    const set = collapsed()

    let skip = 0
    for (const node of directoryTree()[0]) {
      const skipped = skip > 0
      if (skipped) skip--
      else collapsedList.push(node)

      if (node.type === "directory" && (skipped || set.has(node))) {
        skip += node.contents.length
      }
    }

    return collapsedList
  })

  return (
    <>
      <div
        class=" flex h-full border-r-2 border-slate-400 border-opacity-20"
        style={{ width: "25%", "min-width": "250px" }}
      >
        <div class="flex w-18 dark:bg-[#1e1e1e] bg-white flex-col justify-between items-center font-semibold p-2 py-4 border-r-2 border-opacity-20 border-slate-400">
          <div
            class="font-semibold hover:text-green-400 hover:opacity-90 transition-all cursor-pointer mt-4"
            onClick={() => {
              // TODO: show modal of settings like in obsidian
              // user.setMode("Settings")
            }}
          >
            <Icon name="FileSearch" />
          </div>
          <div class="p-1 px-2 rounded-md"></div>
          <div class="flex flex-col items-center gap-3">
            {/* <div
              class="font-semibold hover:text-green-400 hover:opacity-90 transition-all cursor-pointer"
              onClick={() => {
                // TODO: fix sign in
                // user.setShowSignIn(true)
              }}
            >
              <Icon name="UserProfile" />
            </div> */}
            <div
              class="font-semibold hover:text-green-400 hover:opacity-90 transition-all cursor-pointer"
              onClick={() => {
                // user.setMode("Settings")
                console.log("run")
                global.set("showModal", "needToLoginInstructions")
              }}
            >
              <Tooltip
                label={localStorage.getItem("hanko") ? "Profile" : "Sign In"}
              >
                <Icon name="UserProfile" />
              </Tooltip>
            </div>
            <div
              class="font-semibold hover:text-green-400 hover:opacity-90 transition-all cursor-pointer"
              onClick={() => {
                // TODO: show modal of settings like in obsidian
                user.setMode("Settings")
              }}
            >
              <Tooltip label="Settings">
                <Icon name="Settings" />
              </Tooltip>
            </div>
          </div>
        </div>
        <div
          id="ContentSidebar"
          class="dark:bg-[#1e1e1e] bg-white w-full overflow-auto"
        >
          <div
            class="flex flex-col w-full gap-3 px-6 pl-4 py-4 font-semibold"
            style={{ "font-size": "14px" }}
          >
            <div class="font-bold opacity-70 rounded-md p-1  w-full">
              Topics
            </div>
            <div class="h-screen">
              <Motion.div class="pl-6 overflow-hidden opacity-70 flex flex-col">
                <For each={collapsedList()}>
                  {(item) => {
                    return (
                      <div
                        // Add hover styling here
                        onClick={() => {
                          toggleCollapsed(item)
                          if (item.type === "file") {
                            global.set({
                              currentlyOpenFile: global.state.files.find(
                                (f) => f.filePath === item.path,
                              ),
                            })
                          }
                        }}
                        class={clsx(
                          "flex cursor-pointer hover:bg-gray-200 hover:rounded-[6px]",
                        )}
                      >
                        <div
                          style={{ "padding-left": `${item.depth * 10}px` }}
                          class={clsx(
                            "flex cursor-pointer  p-1 ",
                            item.type !== "directory" && "ml-[24px]",
                            item.depth > 0 &&
                              "border-l-[0.1px] border-black border-opacity-60",
                          )}
                        >
                          <div>
                            <Show when={item.type === "directory"}>
                              {/* <Show
                                when={!collapsed().has(item)}
                                fallback={<Icon name={"ArrowRight"} />}
                              >
                                <Icon name={"ArrowDown"} />
                              </Show> */}
                              <div
                                class={clsx(
                                  " transition-all",
                                  !collapsed().has(item) && "rotate-90",
                                )}
                              >
                                <Icon name={"ArrowRight"} />
                              </div>
                            </Show>
                          </div>
                          <div class="flex items-center justify-center">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    )
                  }}
                </For>
                {/* <For each={wiki.wiki.sidebarTopics}>
                {(topic) => {
                  // TODO: use indent levels to make pretty sidebar
                  return (
                    <div
                      class="cursor-pointer hover:text-green-400 hover:opacity-90 transition-all"
                      onClick={() => {
                        wiki.setOpenTopic(topic.prettyName)
                      }}
                    >
                      {topic.prettyName}
                    </div>
                  )
                }}
              </For> */}
              </Motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
