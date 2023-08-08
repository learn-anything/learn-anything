import { For } from "solid-js"
import { useUser } from "../GlobalContext/user"
import { useWiki } from "../GlobalContext/wiki"

export default function Sidebar() {
  const user = useUser()
  const wiki = useWiki()

  return (
    <>
      <div
        class=" flex h-full border-r-2 border-slate-400 border-opacity-20"
        id="Sidebar"
        style={{ width: "25%", "min-width": "250px" }}
      >
        <div class="flex w-18 dark:bg-[#1e1e1e] bg-white flex-col justify-between items-center font-semibold p-2 py-4 border-r-2 border-opacity-20 border-slate-400">
          <div class="p-1 px-2 rounded-md">Wiki</div>
          <div class="flex flex-col items-center gap-3">
            <div
              class="font-semibold hover:text-green-400 hover:opacity-90 transition-all cursor-pointer"
              onClick={() => {
                user.setMode("Settings")
              }}
            >
              Settings
            </div>
            <div
              class="font-semibold hover:text-green-400 hover:opacity-90 transition-all cursor-pointer"
              onClick={() => {
                user.setShowSignIn(true)
              }}
            >
              Sign
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
            <div class="pl-6 overflow-hidden opacity-70 flex flex-col gap-2 border-l border-opacity-30 border-slate-100">
              <For each={wiki.wiki.sidebarTopics}>
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
              </For>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
