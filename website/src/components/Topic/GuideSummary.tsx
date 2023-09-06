import { Show, createSignal, onMount } from "solid-js"
import { useTopic } from "../../GlobalContext/topic"

export default function GuideSummary(props: any) {
  const [showSummary, setShowSummary] = createSignal(false)
  const topic = useTopic()

  return (
    <>
      <style>{`
      #GuideSummaryExpanded {
        height: 100%;

      }
      #GuideSummaryMinimised {
        height: 97px
      }
    `}</style>
      <div class="w-full flex flex-col gap-4 text-[16px]  leading-[18.78px]">
        <div class="flex justify-between items-center ">
          {/* <div class="font-bold text-[#131313]">GUIDE</div> */}
          <div class="text-[#696969] cursor-pointer hover:text-black transition-all">
            v1.0
          </div>
          <div
            class="text-[#696969] cursor-pointer hover:text-black transition-all"
            onClick={() => {
              props.setCurrentTab("EditGuide")
            }}
          >
            Improve Guide
          </div>
        </div>
        <div
          id={showSummary() ? "GuideSummaryExpanded" : "GuideSummaryMinimised"}
          class="bg-[#FAFAFA] flex flex-col gap-2 rounded-[2px] p-4 w-full"
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
              <Show when={topic.topic.guideSummary.split(/\s+/).length > 30}>
                <Show when={showSummary()} fallback={<div>Expand</div>}>
                  Minimise
                </Show>
              </Show>
            </div>
          </div>
          <div class="text-[#696969] font-light overflow-hidden text-ellipsis">
            {topic.topic.guideSummary}
          </div>
        </div>
        <div class="w-full flex justify-between items-center text-[#696969]">
          {/* <div>Contents</div> */}
          <div class="flex gap-[23px]">
            {/* <div>Duplicate</div> */}
            {/* <div
              onClick={() => {
                props.setCurrentTab("EditGuide")
              }}
            >
              Improve Guide
            </div> */}
            {/* <div>Filter</div> */}
          </div>
        </div>
      </div>
    </>
  )
}
