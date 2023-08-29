import { Show, createEffect, createSignal } from "solid-js"
import { createShortcut } from "@solid-primitives/keyboard"

export default function GuideSummaryEdit() {
  const [editSummary, setEditSummary] = createSignal(false)

  createEffect(() => {
    const editableDiv = document.getElementById("GuideSummary")!

    editableDiv.addEventListener("click", () => {
      editableDiv.setAttribute("contenteditable", "true")
      editableDiv.focus()
    })
    createShortcut(["ENTER"], () => {
      var details = document.getElementById("GuideSummary")!.innerHTML
      console.log(details, "Details")
      setEditSummary(false)
    })
  })

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
          <div
            class="border-[#696969] border p-[8px] px-[10px] rounded-[4px] text-[#696969] font-light hover:bg-gray-300 hover:bg-opacity-50 cursor-pointer transition-all"
            onClick={() => {}}
          >
            Cancel
          </div>
          <div class="bg-[#3B5CCC] text-white border-[#3B5CCC] border px-[10px] p-[8px] rounded-[4px] font-light cursor-pointer">
            Submit Changes
          </div>
        </div>
        <div
          // id={showSummary() ? "GuideSummaryExpanded" : "GuideSummaryMinimised"}
          class="bg-[#FAFAFA] flex flex-col gap-2 rounded-[2px] p-4 w-full"
        >
          <div class="flex justify-between items-center">
            <div class="text-[#696969] ">Summary</div>
            <div
              class="text-[#3B5CCC] cursor-pointer select-none"
              onClick={() => {
                // setShowSummary(!showSummary())
              }}
            >
              {/* <Show when={true} fallback={<div>Expand</div>}>
                Minimise
              </Show> */}
            </div>
          </div>
          <div
            class="text-[#696969] font-light overflow-hidden text-ellipsis outline-none"
            id="GuideSummary"
            onClick={() => {
              setEditSummary(true)
            }}
            contentEditable={editSummary()}
          >
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Voluptatem, dolor ratione est iste facilis et accusantium tempore
            eius, cumque aut voluptate veritatis in qui doloremque. Aspernatur
            aliquid et vitae sint. Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Voluptatem, dolor ratione est iste facilis et
            accusantium tempore eius, cumque aut voluptate veritatis in qui
            doloremque. Aspernatur aliquid et vitae sint.
          </div>
        </div>
        <div class="w-full flex justify-between items-center text-[#696969]">
          <div>Contents</div>
          <div class="flex gap-[23px]">
            {/* <div>Duplicate</div> */}
            <div>Improve Guide</div>
            {/* <div>Filter</div> */}
          </div>
        </div>
      </div>
    </>
  )
}
