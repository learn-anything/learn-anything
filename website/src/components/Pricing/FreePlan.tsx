import clsx from "clsx"
import { Show } from "solid-js"
import { useUser } from "../../GlobalContext/user"

export default function FreePlan() {
  const user = useUser()
  return (
    <div
      id="InfoFree"
      class="w-full min-h-full p-8 flex flex-col gap-6 justify-between"
    >
      <div class="border border-slate-400 border-opacity-30 px-2 p-0.5 w-fit rounded-full font-light text-sm">
        Free
      </div>
      <div class="w-full h-full flex flex-col gap-4">
        <div class="text-2xl font-semibold">
          $0 <span class="opacity-90 font-light text-sm">per month</span>
        </div>
        <div class="font-light opacity-60 flex flex-col gap-3">
          <div>
            • Free{" "}
            <a href="https://github.com/learn-anything/learn-anything.xyz">
              open source
            </a>{" "}
            desktop app to edit your notes like Obsidian
          </div>
          <div>• See parts of guides available. Explore the topic graph.</div>
        </div>
      </div>
      <Show when={!user.user.member}>
        <div
          class={clsx(
            "flex items-center justify-center rounded-lg bg-black w-full p-3 opacity-80 text-white",
            true && "bg-neutral-800 opacity-80 text-gray-300"
          )}
        >
          Current plan
        </div>
      </Show>
    </div>
  )
}
