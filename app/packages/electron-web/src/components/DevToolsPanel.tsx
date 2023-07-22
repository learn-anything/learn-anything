import { devTest, syncWikiFromSeed, clearTinybase } from "#preload"
import { Show, createSignal, onMount } from "solid-js"
import Icon from "./Icon"

// lists useful functions you can run from electron preload file
export default function DevToolsPanel() {
  const [minimiseDevTools, setMinimiseDevTools] = createSignal(false)

  // runs a devTest function from preload
  // useful for testing
  onMount(async () => {
    await devTest()
  })

  return (
    <>
      <style>
        {`
      #ClosedDevTools {
        width: 50px;
        height: 50px;
      }
      #OpenedDevTools {
        width: 320px;
        height: 320px;
      }
      `}
      </style>
      <div
        id={minimiseDevTools() ? "OpenedDevTools" : "ClosedDevTools"}
        class="fixed flex flex-col items-center p-4 bottom-5 transition-all duration-500 right-5 rounded-xl border-slate-400 border border-opacity-50 bg-[#222222] overflow-hidden"
      >
        <div
          class="absolute top-3 right-3 cursor-pointer"
          onClick={() => {
            setMinimiseDevTools(!minimiseDevTools())
            console.log(minimiseDevTools(), "devtools")
          }}
        >
          <Icon name="Minimise" />
        </div>
        <Show when={minimiseDevTools()}>
          <div>
            <div class="flex items-center text-lg justify-center font-semibold w-full">
              DevTools
            </div>
            <div class="flex w-full h-full  items-center p-5 text-lg flex-col gap-2">
              <div
                class="cursor-pointer hover:text-green-400 hover:opacity-90 transition-all"
                onClick={() => {
                  syncWikiFromSeed()
                }}
              >
                Seed TinyBase
              </div>
              <div
                class="cursor-pointer hover:text-green-400 hover:opacity-90 transition-all"
                onClick={() => {
                  clearTinybase()
                }}
              >
                Clear TinyBase
              </div>
            </div>
          </div>
        </Show>
      </div>
    </>
  )
}
