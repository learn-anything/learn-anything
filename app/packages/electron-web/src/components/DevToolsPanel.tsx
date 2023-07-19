import { getTopicsSidebar, syncWikiFromSeed } from "#preload"

// lists useful functions you can run from electron preload file
export default function DevToolsPanel() {
  return (
    <div class="fixed flex flex-col items-center p-4 bottom-5 right-5 rounded-xl border-slate-400 border border-opacity-50 bg-transparent w-80 h-80">
      <div class="flex items-center text-lg justify-center font-semibold w-full">
        DevTools
      </div>
      <div class="flex w-full h-full  items-center p-5 text-lg flex-col gap-2">
        <div
          class="cursor-pointer"
          onClick={() => {
            syncWikiFromSeed()
          }}
        >
          Seed TinyBase
        </div>
        <div
          class="cursor-pointer"
          onClick={async () => {
            const topics = await getTopicsSidebar()
            console.log(topics, "topics")
          }}
        >
          Load Sidebar
        </div>
      </div>
    </div>
  )
}
