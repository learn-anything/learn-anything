import { For, Show, createMemo, onMount } from "solid-js"
import { useEditGuide } from "../../GlobalContext/edit-guide"
import { signedIn } from "../../../lib/auth"
import { useMobius } from "../../root"
import { useGlobalState } from "../../GlobalContext/global"
import { Search, createSearchState } from "../Search"

export default function GuideSummaryEdit() {
  const editedGuide = useEditGuide()
  const global = useGlobalState()
  const mobius = useMobius()

  // const [editedGuideForm, setEditedGuideForm] = createStore<Guide>({
  //   summary: "",
  //   sections: []
  // });

  // const updateEditedGuideFormField = (fieldName: string) => (event: Event) => {
  //   const inputElement = event.currentTarget as HTMLInputElement;
  //   setEditedGuideForm({
  //     [fieldName]: inputElement.value
  //   });
  // };

  const searchResults = createMemo(() => {
    return global.state.globalTopicsSearchList.map((topic) => {
      // global.searchGlobalLinksByTitle(
      //   e.target.value,
      // )
      return {
        name: topic.prettyName,
        action: () => {
          console.log("action")
        },
      }
    })
  })

  const search_state = createSearchState(() => searchResults())

  onMount(async () => {
    if (signedIn()) {
      const globalTopic = await mobius.query({
        getGlobalTopic: {
          where: {
            // TODO: get topic name from route
            topicName: "3d-printing",
          },
          select: {
            prettyName: true,
            topicSummary: true,
          },
        },
      })
      if (globalTopic !== null) {
        // @ts-ignore
        editedGuide.set(globalTopic.data.getGlobalTopic)
      }
    } else {
      // TODO: check that user is signed in admin of topic
      // in future allow all users to edit guides, for now just admins
      // if not, navigate back to <topic>
      // await mobius.
      // if (!admin) { navigate() }
    }
  })

  // createEffect(() => {
  //   const editableDiv = document.getElementById("GuideSummary")!

  //   editableDiv.addEventListener("click", () => {
  //     editableDiv.setAttribute("contenteditable", "true")
  //     editableDiv.focus()
  //   })
  //   createShortcut(["ENTER"], () => {
  //     let summary = document.getElementById("GuideSummary")!.innerHTML
  //   })
  // })

  // createEffect(() => {
  //   editedGuide.globalTopic.globalGuide.sections.map((section, index) => {
  //     const editableDiv = document.getElementById(`${section.title}${index}`)!

  //     editableDiv.addEventListener("click", () => {
  //       editableDiv.setAttribute("contenteditable", "true")
  //       editableDiv.focus()
  //     })
  //     createShortcut(["ENTER"], () => {
  //       let sectionTitle = document.getElementById(
  //         `${section.title}${index}`,
  //       )!.innerHTML
  //     })
  //   })
  // })

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
          <div
            onClick={() => {
              console.log("run")
              console.log(editedGuide.guide.sections)
              editedGuide.guide.sections.map((section) => {
                section.links.map((link, index) => {
                  console.log(`${section.title}-link-title-${index}`, "id")
                  console.log(
                    document.getElementById(
                      `${section.title}-link-title-${index}`,
                    ),
                    "link title",
                  )
                })
              })
            }}
            class="bg-[#3B5CCC] text-white border-[#3B5CCC] border px-[10px] p-[8px] rounded-[4px] font-light cursor-pointer"
          >
            Submit Changes
          </div>
        </div>
        <div class="bg-[#FAFAFA] flex flex-col gap-2 rounded-[2px] p-4 w-full">
          <div class="flex justify-between items-center">
            <div class="text-[#696969] ">Summary</div>
            <div
              class="text-[#3B5CCC] cursor-pointer select-none"
              onClick={() => {}}
            ></div>
          </div>
          <Show
            when={editedGuide.guide.summary.length > 0}
            fallback={
              <div
                class="text-[#696969] font-light overflow-hidden text-ellipsis outline-none"
                id="GuideSummary"
                onClick={() => {}}
              >
                Add summary
              </div>
            }
          >
            <div
              class="text-[#696969] font-light overflow-hidden text-ellipsis outline-none"
              id="GuideSummary"
              onClick={() => {}}
            >
              {editedGuide.guide.summary}
            </div>
          </Show>
        </div>
        <div
          class="bg-[#3B5CCC] text-white p-3 rounded-[4px] flex justify-center items-center cursor-pointer hover:bg-[#3554b9] transition-all"
          onClick={() => {
            editedGuide.addSection({
              order: 0,
              title: "",
              ordered: true,
              links: [],
            })
            console.log(editedGuide.guide.sections, "sections")
          }}
        >
          Add section
        </div>
        <For each={editedGuide.guide.sections}>
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
                <div class="flex flex-col">
                  <For each={section.links}>
                    {(link, index) => {
                      let linkTitleId = `${section.title}-link-title-${index}`
                      let linkUrlId = `${section.title}-link-url-${index}`
                      return (
                        <div class="flex items-center gap-6 justify-between border-b border-slate-400 border-opacity-30 p-2">
                          <div class="w-full  h-full flex justify-between items-center">
                            <div class="w-fit gap-1 flex flex-col">
                              <div class="font-bold text-[#3B5CCC]">
                                <Search
                                  placeholder={"Search title"}
                                  state={search_state}
                                />
                                <input
                                  class="border border-slate-400 border-opacity-30 rounded-[6px] px-2 py-1"
                                  id={linkTitleId}
                                  type="text"
                                  placeholder="Title"
                                  onInput={(e) => {
                                    global.searchGlobalLinksByTitle(
                                      e.target.value,
                                    )
                                  }}
                                  value={link.title}
                                />
                              </div>
                              <div class="flex w-full">
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
                                <div class="font-light w-full text-[12px] text-[#696969]">
                                  <input
                                    class="border border-slate-400 border-opacity-30 rounded-[6px] px-2 py-1 w-full"
                                    type="text"
                                    id={linkUrlId}
                                    placeholder="URL"
                                    value={link.title}
                                  />
                                </div>
                              </div>
                            </div>
                            <div class="flex gap-5 text-[14px] opacity-50">
                              <div
                                onClick={async () => {
                                  const linkUrlElement =
                                    document.getElementById(
                                      linkUrlId,
                                    ) as HTMLInputElement
                                  const linkUrl = linkUrlElement?.value
                                  const res = await mobius.query({
                                    checkForGlobalLink: {
                                      where: {
                                        linkUrl: linkUrl,
                                      },
                                      select: {
                                        url: true,
                                        title: true,
                                      },
                                    },
                                  })
                                  console.log(res, "res")
                                }}
                                class="cursor-pointer"
                              >
                                Check URL
                              </div>
                              <div class="cursor-pointer">Sort</div>
                              <div class="cursor-pointer">Delete</div>
                            </div>
                          </div>
                        </div>
                      )
                    }}
                  </For>
                </div>
                <div class="w-full justify-end flex">
                  <div
                    class="bg-[#3B5CCC] text-white text-[14px] p-2 px-4 rounded-[6px] flex justify-center items-center cursor-pointer hover:bg-[#3554b9] transition-all"
                    onClick={() => {
                      editedGuide.addLinkToSection(0, {
                        title: "",
                        url: "",
                      })
                      console.log(section.links, "links")
                    }}
                  >
                    Add link
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
