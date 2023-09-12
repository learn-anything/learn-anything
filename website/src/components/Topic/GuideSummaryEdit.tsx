import { For, Show, createEffect, createSignal } from "solid-js"
import { createShortcut } from "@solid-primitives/keyboard"
import { useTopic } from "../../GlobalContext/topic"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import { div } from "edgedb/dist/primitives/bigint"

export default function GuideSummaryEdit() {
  const topic = useGlobalTopic()

  createEffect(() => {
    const editableDiv = document.getElementById("GuideSummary")!

    editableDiv.addEventListener("click", () => {
      editableDiv.setAttribute("contenteditable", "true")
      editableDiv.focus()
    })
    createShortcut(["ENTER"], () => {
      let summary = document.getElementById("GuideSummary")!.innerHTML
      console.log(summary, "summary")
    })
  })

  createEffect(() => {
    topic.globalTopic.globalGuide.sections.map((section, index) => {
      console.log(`${section.title}${index}`, "WAT")
      const editableDiv = document.getElementById(`${section.title}${index}`)!

      editableDiv.addEventListener("click", () => {
        editableDiv.setAttribute("contenteditable", "true")
        editableDiv.focus()
      })
      createShortcut(["ENTER"], () => {
        let sectionTitle = document.getElementById(
          `${section.title}${index}`,
        )!.innerHTML
        console.log(sectionTitle, "section title")
        console.log(`${section.title}${index}`, "section title id")
      })
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
          <Show
            when={topic.globalTopic.globalGuide.summary.length > 0}
            fallback={
              <div
                class="text-[#696969] font-light overflow-hidden text-ellipsis outline-none"
                id="GuideSummary"
                onClick={() => {
                  // setEditSummary(true)
                }}
                // contentEditable={editSummary()}
              >
                Add summary
              </div>
            }
          >
            <div
              class="text-[#696969] font-light overflow-hidden text-ellipsis outline-none"
              id="GuideSummary"
              onClick={() => {
                // setEditSummary(true)
              }}
              // contentEditable={editSummary()}
            >
              {topic.globalTopic.globalGuide.summary}
            </div>
          </Show>
        </div>
        <div
          class="bg-[#3B5CCC] text-white p-3 rounded-[4px] flex justify-center items-center cursor-pointer hover:bg-[#3554b9] transition-all"
          onClick={() => {
            topic.addSection({
              order: 0,
              title: "hello",
              ordered: true,
              links: [],
            })
            console.log(topic.globalTopic.globalGuide.sections, "sections")
          }}
        >
          Add section
        </div>
        <For each={topic.globalTopic.globalGuide.sections}>
          {(section, index) => {
            return (
              <div class="border border-slate-400 border-opacity-30 rounded-lg flex flex-col gap-4 p-4">
                <Show
                  when={section.title.length > 0}
                  fallback={
                    <div
                      class="text-[#696969] font-light overflow-hidden text-ellipsis outline-none"
                      id={`${section.title}${index()}`}
                      onClick={() => {}}
                    >
                      Add section title
                    </div>
                  }
                >
                  <div
                    class="text-[#696969] font-light overflow-hidden text-ellipsis outline-none"
                    id={`${section.title}${index()}`}
                    onClick={() => {}}
                  >
                    {section.title}
                  </div>
                </Show>
              </div>
            )
          }}
        </For>
      </div>
    </>
  )
}
