import { div } from "edgedb/dist/primitives/bigint"
import { Show, createSignal } from "solid-js"

export default function GuideSummary() {
  const [showSummary, setShowSummary] = createSignal(false)
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
      <div class="w-full flex flex-col gap-4 text-[16px] leading-[18.78px]">
        <div class="flex justify-between items-center ">
          <div class="font-bold text-[#131313]">GUIDE</div>
          <div class="text-[#696969]">v1.0</div>
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
              <Show when={showSummary()} fallback={<div>Expand</div>}>
                Minimise
              </Show>
            </div>
          </div>
          <div class="text-[#696969] font-light overflow-hidden text-ellipsis">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Voluptatem, dolor ratione est iste facilis et accusantium tempore
            eius, cumque aut voluptate veritatis in qui doloremque. Aspernatur
            aliquid et vitae sint.
          </div>
        </div>
        <div class="w-full flex justify-between items-center text-[#696969]">
          <div>Contents</div>
          <div class="flex gap-[23px]">
            <div>Duplicate</div>
            <div>Improve Guide</div>
            <div>Filter</div>
          </div>
        </div>
      </div>
    </>
  )
}
