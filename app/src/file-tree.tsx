import * as solid from "solid-js"
import { ui } from "@la/shared"
import { useGlobalState } from "./GlobalContext/global"
import clsx from "clsx"
// @ts-ignore
import { Motion } from "@motionone/solid"

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

export const FileTree: solid.Component = () => {
  const global = useGlobalState()

  const directoryTree = solid.createMemo(() => {
    return filepathsToTree(global.state.files.map((f) => f.filePath))
  })

  const [collapsed, setCollapsed] = solid.createSignal(
    new WeakSet<TreeContent>(),
    {
      equals: false,
    },
  )

  const toggleCollapsed = (node: TreeContent) => {
    setCollapsed((set) => {
      set.delete(node) || set.add(node)
      return set
    })
  }

  const collapsedList = solid.createMemo(() => {
    const collapsed_list: TreeContent[] = []
    const set = collapsed()

    let skip = 0
    for (const node of directoryTree()[0]) {
      const skipped = skip > 0
      if (skipped) skip--
      else collapsed_list.push(node)

      if (node.type === "directory" && (skipped || set.has(node))) {
        skip += node.contents.length
      }
    }

    return collapsed_list
  })

  return (
    <div class="dark:bg-[#1e1e1e] bg-white h-full overflow-auto">
      <div
        class="flex flex-col w-full gap-3 px-4 py-4 font-semibold"
        style={{ "font-size": "14px" }}
      >
        <div class="font-bold opacity-70 rounded-md p-1  w-full">Topics</div>
        <div class="h-full">
          <Motion.div class="pl-2 overflow-hidden opacity-70 flex flex-col">
            <solid.For each={collapsedList()}>
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
                      "flex cursor-pointer px-[1px] hover:bg-gray-200 dark:hover:bg-neutral-800 hover:rounded-[6px]",
                    )}
                  >
                    <div
                      style={{ "padding-left": `${item.depth * 10}px` }}
                      class={clsx(
                        "flex cursor-pointer  p-1 ",
                        item.type !== "directory" && "ml-[24px]",
                        item.depth > 0 &&
                          "border-l-[0.1px] border-black/60 dark:border-white/40",
                      )}
                    >
                      <div>
                        <solid.Show when={item.type === "directory"}>
                          {/* <Show
                          when={!collapsed().has(item)}
                          fallback={<ui.Icon name={"ArrowRight"} />}
                        >
                          <ui.Icon name={"ArrowDown"} />
                        </Show> */}
                          <div
                            class={clsx(
                              " transition-all",
                              !collapsed().has(item) && "rotate-90",
                            )}
                          >
                            <ui.Icon name={"ArrowRight"} />
                          </div>
                        </solid.Show>
                      </div>
                      <div class="flex items-center justify-center">
                        {item.name}
                      </div>
                    </div>
                  </div>
                )
              }}
            </solid.For>
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
  )
}
