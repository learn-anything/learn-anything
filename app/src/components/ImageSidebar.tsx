import { For, createSignal } from "solid-js"

export default function ImageSidebar() {
  const [trendingTopics, setTrendingTopics] = createSignal([
    "Science",
    "Math",
    "3D Design",
    "Astrology",
  ])
  const [recentTopics, setRecentTopics] = createSignal([
    "Valorant",
    "Minecraft",
    "Website Design",
  ])
  return (
    <>
      <div
        class=" border-r h-full p-5 border-slate-400 border-opacity-30"
        style={{ width: "20%", "min-width": "210px" }}
      >
        <div class="flex flex-col gap-5">
          <div id="TrendingTopics" class="">
            <div class="font-light text-lg pb-5 pt-2">
              Trending{" "}
              <span class="font-bold text-green-400 opacity-90">Tags</span>
            </div>
            <div class="h-full flex flex-wrap gap-2">
              <For each={trendingTopics()}>
                {(topic) => (
                  <div class="p-0.5 cursor-pointer hover:border-green-300 hover:opacity-60 transition-all hover:text-green-300 text-sm font-semibold opacity-80 px-5 w-fit rounded-full gap-2 border-slate-400 border border-opacity-50">
                    {topic}
                  </div>
                )}
              </For>
            </div>
          </div>
          <div id="RecentTopics" class="">
            <div class="font-light text-lg pb-5 pt-5">
              Recent{" "}
              <span class="font-bold text-green-400 opacity-90">Tags</span>
            </div>
            <div class="h-full flex flex-wrap gap-2">
              <For each={recentTopics()}>
                {(topic) => (
                  <div class="p-0.5 cursor-pointer hover:border-green-300 hover:opacity-60 transition-all hover:text-green-300 text-sm font-semibold opacity-80 px-5 w-fit rounded-full gap-2 border-slate-400 border border-opacity-50">
                    {topic}
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
