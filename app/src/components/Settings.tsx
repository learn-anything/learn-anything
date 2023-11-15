import { createSignal } from "solid-js"
// import { connectWiki } from "#preload"

import { useWiki } from "../GlobalContext/wiki"
import Modal from "./Modal"
import { useGlobalState } from "../GlobalContext/global"
import Checkbox from "./checkbox"
import Icon from "./Icon"
import { useUser } from "../GlobalContext/user"

export default function Settings() {
  const wiki = useWiki()
  const global = useGlobalState()
  const user = useUser()
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
      <div class="w-5/6 flex relative h-3/4 bg-white dark:bg-neutral-900 rounded-lg border-2 dark:border-neutral-700 border-slate-400">
        <div class="absolute top-2 right-2 hover:opacity-60 transition-all">
          <Icon name="Close"></Icon>
        </div>
        <div class="h-full border-r-2 dark:border-neutral-700 p-3 border-slate-400 min-w-[200px]">
          <div class="text-[10px] opacity-70 pb-1">Settings</div>
          <div class="flex gap-1 flex-col w-full">
            <div class="hover:bg-neutral-800 px-2 p-1 w-full rounded-[6px]">
              Editor
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>
  )
}
