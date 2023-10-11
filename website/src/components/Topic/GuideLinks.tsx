import { For, Show } from "solid-js"
import { useGlobalTopic } from "../../GlobalContext/global-topic"

export default function GuideLinks() {
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
      <div id="GuideLinks" class="overflow-auto flex flex-col gap-4 w-full">
        <For each={topic.globalTopic.links}>
          {(link) => {
            return (
              <div class="flex items-center rounded-[6px]  border-[0.5px] dark:border-[#282828] border-[#69696951] p-4 px-4 justify-between">
                {/* <div class="">
              <div class="bg-neutral-400 w-10 h-10 rounded-full"></div>
            </div> */}
                <div class="w-full  h-full flex justify-between items-center">
                  <div class="w-fit flex gap-1 flex-col">
                    <div class="font-bold text-[#3B5CCC] ">{link.title}</div>
                    <div class="flex gap-3">
                      {/* <Show when={link?.type}>
                    <div class="font-light text-[12px] text-[#696969] border-r border-[#CCCCCC] px-2">
                      {link?.type}
                    </div>
                  </Show> */}
                      <Show when={link.year}>
                        <div class="font-light text-[12px] text-[#696969]">
                          {link.year}
                        </div>
                      </Show>

                      <div class="font-light text-[12px] text-[#696969]">
                        {link.url}
                      </div>
                    </div>
                    {/* <div class="font-light text-[12px] text-[#696969]">PDF</div> */}
                  </div>
                </div>
              </div>
            )
          }}
        </For>
      </div>
    </>
  )
}
