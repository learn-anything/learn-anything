import { For, Show, createEffect, createSignal, untrack } from "solid-js"
import { createShortcut } from "@solid-primitives/keyboard"
import { ui } from "@la/shared"
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
  const [topics, setTopics] = createSignal([
    "NLP",
    "Chemistry",
    "Physics",
    "Nature",
    "Math"
  ])
  const [topicSearchResults, setTopicSearchResults] = createSignal<string[]>([])
  const [topicSearchInput, setTopicSearchInput] = createSignal("")
  const [focusedTopic, setFocusedTopic] = createSignal(0)
  const [focusedTodoTitle, setFocusedTodoTitle] = createSignal("")

  createShortcut(["ARROWDOWN"], () => {
    if (focusedTopic() === topicSearchResults().length - 1) {
      setFocusedTopic(0)
      return
    }
    setFocusedTopic(focusedTopic() + 1)
  })
  createShortcut(["ARROWUP"], () => {
    if (focusedTopic() === 0) {
      setFocusedTopic(topicSearchResults().length - 1)
      return
    }
    setFocusedTopic(focusedTopic() - 1)
  })

  createEffect(() => {
    if (topicSearchInput()) {
      untrack(() => {
        setTopicSearchResults(topics())
        setTopicSearchResults(
          topicSearchResults().filter((word: string) =>
            topicSearchInput()
              .split("")
              .every((value) => {
                return word.split("").includes(value)
              })
          )
        )
      })
      setFocusedTodoTitle(topicSearchResults()[focusedTopic()])
    }
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
          transform: translateX(800px)
        }
        100% {
          transform: translateX(0px)
        }
      }
      `}
      </style>
      <div class="pt-6 flex flex-col gap-6 leading-[18.78px] border-[#EAEAEA] border rounded-lg p-3">
        <Show when={editGuide.editedGuide.editingSection}>
          <div class="fixed top-0 left-0 w-screen h-screen flex items-center justify-end z-10">
            <div
              class="fixed top-0 left-0 backdrop-blur-sm w-screen h-screen z-20"
              onClick={() => {
                editGuide.setEditingSection(0)
              }}
            ></div>
            <div id="EditSection" class="bg-gray-200 p-2 z-30 w-[65%] h-full">
              <div class="rounded-[8px] relative flex flex-col gap-4 p-4 h-full w-full bg-white">
                <div class="text-[20px]">Section Title</div>
                <div
                  class="w-full min-h-[150px] border border-slate-400 border-opacity-30 rounded-md"
                  contentEditable={true}
                ></div>
                <For each={props.links}>
                  {(link) => {
                    return (
                      <div class="flex-between p-5 border rounded-md border-slate-400 border-opacity-30 gap-6">
                        {/* <div class="">
                      <div class="bg-neutral-400 w-10 h-10 rounded-full"></div>
                    </div> */}
                        <div class="w-full  h-full flex-between">
                          <div class="w-fit gap-1 flex flex-col">
                            <div class="font-bold flex gap-2 px-2 text-[#3B5CCC]">
                              <div class="relative w-full">
                                <div class="flex items-center">
                                  <input
                                    type="text"
                                    class="w-full h-full bg-transparent border border-slate-400 rounded-md"
                                    onInput={(e) => {
                                      setTopicSearchInput(e.target.value)
                                    }}
                                  />
                                </div>
                                <Show
                                  when={
                                    topicSearchInput() !== "" &&
                                    topicSearchResults().length !== 0
                                  }
                                >
                                  <div class=" absolute top-[24px] bg-neutral-200 left-0 text-black font-semibold text-opacity-40 flex flex-col rounded w-full">
                                    <For each={topicSearchResults()}>
                                      {(topic) => (
                                        <div
                                          id={
                                            focusedTodoTitle() === topic
                                              ? "Focused"
                                              : "UnFocused"
                                          }
                                          onClick={() => {
                                            setFocusedTopic(
                                              topicSearchResults().indexOf(
                                                topic
                                              )
                                            )
                                          }}
                                          class="px-4 overflow-auto py-2"
                                        >
                                          <div>{topic}</div>
                                        </div>
                                      )}
                                    </For>
                                  </div>
                                </Show>
                              </div>
                              <input
                                type="text"
                                class="border border-slate-400 px-4 p-1 rounded-[4px]"
                              />
                            </div>
                            <div class="flex">
                              <div class="font-light w-[100px] text-[12px] text-[#696969] border-r border-[#CCCCCC] px-2">
                                <input
                                  type="text"
                                  class="border w-full border-slate-400 px-4 p-0.5 rounded-[4px]"
                                />
                              </div>

                              <div class="font-light w-[100px] text-[12px] text-[#696969] border-r border-[#CCCCCC] px-2">
                                <input
                                  type="text"
                                  class="border w-full border-slate-400 px-4 p-0.5 rounded-[4px]"
                                />
                              </div>

                              <div class="font-light w-[100px] text-[12px] text-[#696969] border-r border-[#CCCCCC] px-2">
                                <input
                                  type="text"
                                  class="border w-full border-slate-400 px-4 p-0.5 rounded-[4px]"
                                />
                              </div>

                              <div class="font-light w-[100px] text-[12px] text-[#696969] border-r border-[#CCCCCC] px-2">
                                <input
                                  type="text"
                                  class="border w-full border-slate-400 px-4 p-0.5 rounded-[4px]"
                                />
                              </div>

                              <div class="font-light w-[100px] text-[12px] text-[#696969] px-2">
                                <input
                                  type="text"
                                  class="border w-full border-slate-400 px-4 p-0.5 rounded-[4px]"
                                />
                              </div>
                            </div>
                            {/* <div class="font-light text-[12px] text-[#696969]">PDF</div> */}
                          </div>
                        </div>
                        <div>drag</div>
                      </div>
                    )
                  }}
                </For>
                <div class="absolute bottom-4 px-3 p-1 right-4 bg-blue-400 rounded-[6px] text-white">
                  Save
                </div>
                <div class="absolute bottom-4 px-3 p-1 left-4 border border-slate-400 border-opacity-30 rounded-[6px]">
                  Close
                </div>
              </div>
            </div>
          </div>
        </Show>
        <div class="flex-between">
          <div
            class="text-[#131313] font-bold"
            contentEditable={editSection()}
            id="GuideSectionTitle"
          >
            {props.sectionTitle}
          </div>
          <div
            onClick={() => {
              editGuide.setEditingSection(1)
            }}
            class="font-light"
          >
            Edit section
          </div>
        </div>
        <div class="flex flex-col gap-6">
          <For each={props.links}>
            {(link) => {
              return (
                <div class="flex-between gap-6">
                  {/* <div class="">
                <div class="bg-neutral-400 w-10 h-10 rounded-full"></div>
              </div> */}
                  <div class="w-full  h-full flex-between">
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
                          <ui.Icon name="Plus" />
                        </div>
                        <div class="rounded-[2px] border h-[28px] w-[28px] border-[#CCCCCC]">
                          <ui.Icon name="Checkmark" />
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
            <ui.Icon name="Plus" />
            Add a Link
          </div>
        </div>
        <Show when={addLink()}>
          <div class=" fixed flex-center backdrop-blur-sm w-screen z-10 h-screen top-0 left-0">
            <div
              class="fixed w-screen h-screen top-0 right-0 z-20"
              onClick={() => {
                setAddLink(false)
              }}
            ></div>
            <div class="w-[60%] relative h-[80%] z-30 pb-10 px-10 flex flex-col gap-2 rounded-lg bg-white border-slate-400 border drop-shadow-md">
              <div class="text-xl w-full py-8 border-b border-slate-400 border-opacity-30 flex-center">
                New Link
              </div>
              <div class="py-8 flex flex-col gap-4">
                <div>Section</div>
                <div
                  contentEditable={true}
                  class="min-w-[200px] outline-none text-[14px] text-black text-opacity-70 w-fit rounded-[4px] p-2 px-4 border border-slate-400 border-opacity-50"
                ></div>
              </div>
              <div class="flex flex-col gap-4">
                <div>URL</div>
                <div class="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="URL"
                    class="border-slate-400 font-light border-b rounded-[4px] border-opacity-50 w-full p-2 px-4"
                  />
                  <div>Title</div>
                  <input
                    type="text"
                    placeholder="Title"
                    class="border-slate-400 font-light border-b bg-inherit rounded-[4px] border-opacity-50 w-full p-2 px-4"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-4 pt-8">
                <div>Time</div>
                <div class="w-full flex gap-2">
                  <input
                    type="text"
                    placeholder="time"
                    class="p-2 px-4 rounded-[4px] border-light dark:border-dark w-[30%]"
                  />
                  <input
                    type="text"
                    placeholder="type"
                    class="p-2 px-4 rounded-[4px] border-light dark:border-dark w-[30%]"
                  />
                  <input
                    type="text"
                    placeholder="author"
                    class="p-2 px-4 rounded-[4px] border-light dark:border-dark w-[40%]"
                  />
                </div>
              </div>
              <div class="absolute pb-10 px-10 bottom-0 left-0 flex-between w-full">
                <div class=" px-6 p-3 rounded-[4px] border-light dark:border-dark">
                  Cancel
                </div>
                <div class="bg-blue-400 rounded-[4px] px-6 text-white p-3">
                  Save
                </div>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </>
  )
}
