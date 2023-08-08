import { createSignal } from "solid-js"
// import { connectWiki } from "#preload"

import { useWiki } from "../GlobalContext/wiki"
import Modal from "./Modal"

export default function Settings() {
  const wiki = useWiki()
  const [wikiPathInput, setWikiPathInput] = createSignal("")

  const [wikiPath, setWikiPath] = createSignal("")

  return (
    <>
      <style>
        {`
         #Settings {
          animation: 0.15s ScaleSettings forwards linear
        }
        @keyframes ScaleSettings {
          0% {
            transform: scale(0.8);
            opacity: 0
          }
          100% {
            trasform: scale(1);
            opacity: 1
          }
        }
      `}
      </style>
      <Modal>
        <div
          id="Settings"
          class="rounded-3xl border border-slate-400 border-opacity-30 bg-white dark:bg-neutral-900 w-5/6 h-5/6 flex items-center justify-center"
        >
          <div class="h-full font-bold border-r border-slate-400 border-opacity-30 p-8">
            <div>Settings</div>
          </div>
          <div class="w-full flex items-start h-full p-16 gap-2">
            {/* <div
              onClick={() => {
                wiki.setWikiFolderPath(wikiPathInput())
              }}
              class="font-semibold rounded-md border dark:border-slate-800 border-opacity-40 bg-transparent px-4 p-2 hover:bg-neutral-950 transition-all cursor-pointer"
            >
              Save
            </div> */}
            <button
              onclick={() => {
                // connectWiki(wikiPath())
              }}
            >
              Connect wiki
            </button>
            <input
              type="text"
              placeholder="Enter path to wiki folder"
              class="rounded-md p-2 font-semibold dark:bg-transparent border border-slate-800 w-64 bg-opacity-50 outline-none"
              onChange={(e) => {
                // setWikiPathInput(e.target.value)
                setWikiPath(e.target.value)
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
