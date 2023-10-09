import { createSignal } from "solid-js"
import { useGlobalTopic } from "../../GlobalContext/global-topic"

export default function GuideSummary(props: any) {
  const [showSummary, setShowSummary] = createSignal(false)
  const topic = useGlobalTopic()

  return (
    <>
      <style>{`
      #GuideSummaryExpanded {
        height: 100%;

      }
      #GuideSummaryMinimised {
        height: 100%
      }
    `}</style>
      <div class="w-full flex flex-col gap-3 text-[16px] border-[#69696951] border rounded-[6px] p-3 px-4  leading-[18.78px]">
        <div class="font-light text-[14px] text-black text-opacity-70 flex w-full justify-between">
          <div>Version</div>
          <div>Contributors</div>
        </div>
        <div
          id={showSummary() ? "GuideSummaryExpanded" : "GuideSummaryMinimised"}
          class="bg-white dark:bg-[#141414] flex flex-col gap-2 rounded-[2px] w-full"
        >
          <div class="flex justify-between items-center">
            <div class="text-[#696969] ">Summary</div>
            <div
              class="text-[#3B5CCC] cursor-pointer select-none"
              onClick={() => {
                setShowSummary(!showSummary())
              }}
            >
              {/* don't show minimise/expand if summary is less than 30 words */}
              {/* <Show when={topic.topic.guideSummary.split(/\s+/).length > 30}>
                <Show when={showSummary()} fallback={<div>Expand</div>}>
                  Minimise
                </Show>
              </Show> */}
            </div>
          </div>
          {/* <div class="text-[#696969] font-light overflow-hidden text-ellipsis">
            {topic.topic.guideSummary}
          </div> */}
        </div>
      </div>
    </>
  )
}
