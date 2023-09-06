import { For, Show, createEffect, createSignal } from "solid-js"
import { createShortcut } from "@solid-primitives/keyboard"
import Icon from "../Icon"
import { useEditGuide } from "../../GlobalContext/edit-guide"

export default function GuideSectionEdit(props: any) {
  const [editSection, setEditSection] = createSignal(false)
  const [addLink, setAddLink] = createSignal(false)

  const editGuide = useEditGuide()

  createEffect(() => {
    const editableDiv = document.getElementById("GuideSectionTitle")!

    editableDiv.addEventListener("click", () => {
      editableDiv.setAttribute("contenteditable", "true")
      editableDiv.focus()
    })
    createShortcut(["ENTER"], () => {
      var details = document.getElementById("GuideSummary")!.innerHTML
      console.log(details, "Details")
      setEditSection(false)
    })
  })

  return (
    <>
      <style>
        {`
      #EditSection {
        animation: 0.2s SlideIn forwards ease-in
      }
      @keyframes SlideIn {
        0% {
          transform: translateX()
        }
      }
      `}
      </style>
      <div class="pt-6 flex flex-col gap-6 leading-[18.78px] border-[#EAEAEA] border rounded-lg p-3">
        <div class="fixed top-0 left-0 items-center justify-end w-screen h-screen z-10">
          <div class="fixed top-0 left-0 backdrop-blur-sm w-screen h-screen z-20"></div>
          <div id="EditSection" class="bg-gray-200 w-[800px] h-full"></div>
        </div>
        <div class="flex justify-between items-center">
          <div
            class="text-[#131313] font-bold"
            contentEditable={editSection()}
            id="GuideSectionTitle"
          >
            {props.sectionTitle}
          </div>
          <div onClick={() => {}} class="font-light">
            Edit section
          </div>
        </div>
        <div class="flex flex-col gap-6">
          <For each={props.links}>
            {(link) => {
              return (
                <div class="flex items-center gap-6 justify-between">
                  {/* <div class="">
                <div class="bg-neutral-400 w-10 h-10 rounded-full"></div>
              </div> */}
                  <div class="w-full  h-full flex justify-between items-center">
                    <div class="w-fit flex flex-col">
                      <div class="font-bold text-[#3B5CCC]">{link.title}</div>
                      <div class="flex">
                        <Show when={link?.type}>
                          <div class="font-light text-[12px] text-[#696969] border-r border-[#CCCCCC] px-2">
                            {link?.type}
                          </div>
                        </Show>
                        <Show when={link?.year}>
                          <div class="font-light text-[12px] text-[#696969] border-r border-[#CCCCCC] px-2">
                            {link?.year}
                          </div>
                        </Show>
                        <Show when={link?.author}>
                          <div class="font-light text-[12px] text-[#696969] border-r border-[#CCCCCC] px-2">
                            {link?.author}
                          </div>
                        </Show>
                        <Show when={link?.time}>
                          <div class="font-light text-[12px] text-[#696969] border-r border-[#CCCCCC] px-2">
                            {link?.time}
                          </div>
                        </Show>
                        <div class="font-light text-[12px] text-[#696969] px-2">
                          {link.url}
                        </div>
                      </div>
                      {/* <div class="font-light text-[12px] text-[#696969]">PDF</div> */}
                    </div>
                    <div class="flex items-center gap-[34px]">
                      <div class="gap-4 flex ">
                        <div class="rounded-[2px] border h-[28px] w-[28px] border-[#CCCCCC]">
                          <Icon name="Plus" />
                        </div>
                        <div class="rounded-[2px] border h-[28px] w-[28px] border-[#CCCCCC]">
                          <Icon name="Checkmark" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }}
          </For>
          <div
            class="font-light flex items-center gap-1 text-[16px] text-[#3B5CCC] self-center"
            onClick={() => {
              setAddLink(true)
            }}
          >
            <Icon name="Plus"></Icon>Add a Link
          </div>
        </div>
        <Show when={addLink()}>
          <div class="fixed flex items-center backdrop-blur-sm justify-center w-screen z-10 h-screen top-0 left-0">
            <div
              class="fixed w-screen h-screen top-0 right-0 z-20"
              onClick={() => {
                setAddLink(false)
              }}
            ></div>
            <div class=" z-30 p-3 flex flex-col gap-2 rounded-lg bg-white border-slate-400 border border-opacity-30">
              <div class="text-xl">Add a Link</div>
              <div class="flex items-center justify-center gap-1">
                <input
                  type="text"
                  name=""
                  id=""
                  class="w-full h-full border p-[8px] px-[10px] outline-none border-slate-400 border-opacity-30 rounded-[4px]"
                />
              </div>
              <div>
                <input
                  type="text"
                  name=""
                  id=""
                  class="w-full h-full border p-[8px] px-[10px] outline-none border-slate-400 border-opacity-30 rounded-[4px]"
                />
              </div>
              <div class="px-[10px] p-[8px] border-[#3B5CCC] text-white bg-[#3B5CCC] rounded-[4px]">
                Submit
              </div>
            </div>
          </div>
        </Show>
      </div>
    </>
  )
}
