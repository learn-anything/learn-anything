import clsx from "clsx"
import { For } from "solid-js"
import { useGlobalTopic } from "../../GlobalContext/global-topic"

export default function GuideNotes() {
  const topic = useGlobalTopic()

  return (
    <>
      <style>
        {`
        ::-webkit-scrollbar {
          display: none;
      }
      `}
      </style>
      <div id="GuideLinks" class="h-full flex-col gap-4 w-full">
        <div class="text-[22px] font-bold">{topic.globalTopic.prettyName}</div>
        <For each={topic.globalTopic.notes}>
          {(note) => {
            console.log(note.url)
            return (
              <div
                class={clsx(
                  "bg-white dark:bg-neutral-900 px-4 p-3 text-[#696969] rounded-[6px] dark:border-dark  border-light",
                  note.url &&
                    "text-[#3B5CCC] dark:text-blue-400 cursor-pointer hover:text-opacity-80 transition-all duration-200"
                )}
              >
                {note.content}
              </div>
            )
          }}
        </For>
      </div>
    </>
  )
}
