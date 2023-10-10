import { For, Show, createEffect, createSignal, untrack } from "solid-js"
import { useEditGuide } from "../../GlobalContext/edit-guide"
import { useMobius } from "../../root"
import { Search, createSearchState } from "../Search"
// @ts-ignore
import { Motion } from "@motionone/solid"
import { useNavigate } from "solid-start"
import { GlobalTopic, useGlobalTopic } from "../../GlobalContext/global-topic"

export default function GuideSummaryEdit() {
  const editedGuide = useEditGuide()
  const topic = useGlobalTopic()
  const mobius = useMobius()
  const navigate = useNavigate()

  const [editedGlobalTopic, setEditedGlobalTopic] = createSignal<GlobalTopic>({
    prettyName: "",
    topicPath: "",
    latestGlobalGuide: {
      summary: "",
      sections: [],
    },
    summary: "",
  })

  createEffect(() => {
    if (topic.globalTopic.latestGlobalGuide) {
      untrack(() => {
        setEditedGlobalTopic(topic.globalTopic)
      })
    }
  })

  createEffect(() => {
    console.log(editedGlobalTopic(), "edited global topic")
  })

  // const [currentLinkId, setCurrentLinkId] = createSignal()

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

  // const currentTopicSearchResults = createMemo(async () => {
  //   const links = await mobius.query
  //   return global.state.globalLinks.map((link) => {
  //     return {
  //       name: link.title,
  //       action: () => {
  //         console.log(link.url, "url")
  //       },
  //     }
  //   })
  // })

  // const currentTopicSearchState = createSearchState(() =>
  //   currentTopicSearchResults(),
  // )

  // onMount(async () => {
  //   if (signedIn()) {
  //     const globalTopic = await mobius.query({
  //       getGlobalTopic: {
  //         where: {
  //           // TODO: get topic name from route
  //           topicName: "3d-printing",
  //         },
  //         select: {
  //           prettyName: true,
  //           topicSummary: true,
  //         },
  //       },
  //     })
  //     if (globalTopic !== null) {
  //       // @ts-ignore
  //       editedGuide.set(globalTopic.data.getGlobalTopic)
  //     }
  //   } else {
  //     // TODO: check that user is signed in admin of topic
  //     // in future allow all users to edit guides, for now just admins
  //     // if not, navigate back to <topic>
  //     // await mobius.
  //     // if (!admin) { navigate() }
  //   }
  //})

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
      <div class="w-full flex flex-col gap-4 text-[16px] leading-[18.78px] ">
        <div class="flex justify-between items-center ">
          <Motion.div
            class="border-[#696969] dark:border-gray-200 dark:hover:bg-gray-200 dark:hover:text-black border p-[8px] px-[10px] rounded-[4px] text-[#696969] dark:text-white font-light hover:bg-gray-300 hover:bg-opacity-50 cursor-pointer transition-all"
            onClick={() => {
              // TODO: show prompt 'are you sure', in case there is something in form data

              // TODO: do it in better, more safe way
              let url = window.location.href
              const parts = url.split("/")
              if (parts.length >= 4) {
                url = "/" + parts[3]
              }
              console.log(url)
              navigate(url)
            }}
            transition={{ duration: 1, easing: "ease-out" }}
            animate={{
              opacity: [0, 1, 1],
              transform: [
                "translateX(100px)",
                "translateX(-10px)",
                "translateX(0px)",
              ],
            }}
          >
            Cancel
          </Motion.div>
          <Motion.div
            transition={{ duration: 1, easing: "ease-out", delay: 0.1 }}
            animate={{
              opacity: [0, 1, 1],
              transform: [
                "translateX(100px)",
                "translateX(-10px)",
                "translateX(0px)",
              ],
            }}
            onClick={() => {
              console.log(
                editedGlobalTopic(),
                "edited global topic to send as mutation",
              )
              // console.log("run")
              // console.log(editedGuide.guide.sections)
              // editedGuide.guide.sections.map((section) => {
              //   section.links.map((link, index) => {
              //     console.log(`${section.title}-link-title-${index}`, "id")
              //     console.log(
              //       document.getElementById(
              //         `${section.title}-link-title-${index}`,
              //       ),
              //       "link title",
              //     )
              //   })
              // })
            }}
            class="bg-[#3B5CCC] text-white border-[#3B5CCC] border px-[10px] p-[8px] rounded-[4px] font-light cursor-pointer"
          >
            Submit Changes
          </Motion.div>
        </div>
        <Motion.div
          transition={{ duration: 1, easing: "ease-out", delay: 0.2 }}
          animate={{
            opacity: [0, 1, 1],
            transform: [
              "translateX(100px)",
              "translateX(-10px)",
              "translateX(0px)",
            ],
          }}
          class="bg-[#FAFAFA] dark:bg-neutral-950 flex flex-col gap-2 rounded-[4px] p-4 w-full"
        >
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
              <input
                class="text-[#696969] bg-inherit font-light overflow-hidden text-ellipsis outline-none"
                id="GuideSummary"
                placeholder="Add summary"
                onInput={(e) => {
                  const currentGlobalTopic = editedGlobalTopic()
                  setEditedGlobalTopic({
                    ...currentGlobalTopic,
                    summary: e.target.value,
                  })
                }}
              />
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
        </Motion.div>
        <Motion.div
          transition={{ duration: 1, easing: "ease-out", delay: 0.2 }}
          animate={{
            opacity: [0, 1, 1],
            transform: [
              "translateX(100px)",
              "translateX(-10px)",
              "translateX(0px)",
            ],
          }}
          class="bg-[#3B5CCC] text-white p-3 rounded-[4px] flex justify-center items-center cursor-pointer hover:bg-[#3554b9] transition-all"
          onClick={() => {
            const currentGlobalTopic = editedGlobalTopic()
            let newSections =
              currentGlobalTopic.latestGlobalGuide?.sections || []
            newSections = [
              ...newSections,
              {
                summary: "",
                title: "",
                links: [],
              },
            ]
            setEditedGlobalTopic({
              ...currentGlobalTopic,
              latestGlobalGuide: {
                ...currentGlobalTopic.latestGlobalGuide,
                summary: currentGlobalTopic.latestGlobalGuide?.summary || "",
                sections: newSections,
              },
            })
          }}
        >
          Add section
        </Motion.div>
        <For each={editedGlobalTopic().latestGlobalGuide?.sections}>
          {(section, index) => {
            return (
              <Motion.div
                transition={{ duration: 1, easing: "ease-out", delay: 0.3 }}
                animate={{
                  opacity: [0, 1, 1],
                  transform: ["translateX(100px)", "translateX(-10px)", ""],
                }}
                class="border dark:bg-neutral-900 bg-white border-slate-400 border-opacity-30 rounded-lg flex flex-col"
              >
                <Show
                  when={section.title.length > 0}
                  fallback={
                    <input
                      class="text-[#696969] bg-transparent p-4 font-light overflow-hidden text-ellipsis outline-none"
                      placeholder="Add section title"
                    />
                  }
                >
                  <input
                    class="text-[#696969] bg-transparent p-4 font-light overflow-hidden text-ellipsis outline-none"
                    value={section.title}
                  />
                </Show>

                <div class="flex gap-4 flex-col">
                  <For each={section.links}>
                    {(link, index) => {
                      let linkTitleId = `${section.title}-link-title-${index}`
                      let linkUrlId = `${section.title}-link-url-${index}`
                      return (
                        <Motion.div
                          transition={{
                            duration: Math.min(index() * 0.2 + 0.5, 2),
                            easing: "ease-out",
                          }}
                          animate={{
                            opacity: [0, 1, 1],
                            transform: [
                              "translateX(100px)",
                              "translateX(-10px)",
                              "",
                            ],
                          }}
                          class="flex items-center gap-6 justify-between border p-6 rounded-[6px] border-slate-400 border-opacity-30"
                        >
                          <div class="w-full  h-full flex justify-between items-center">
                            <div class="w-fit gap-4 flex flex-col py-4">
                              {/* <Search
                                placeholder={"Search URL title from all the global links"}
                                state={search_state}
                              /> */}
                              <Search
                                placeholder={
                                  "Search URL title of global links for the topic"
                                }
                                state={topic.topicGlobalLinksSearch}
                              />
                              {/* <div
                                class={clsx(
                                  "relative flex flex-col text-[#3B5CCC]",
                                )}
                              >
                                <div class="absolute px-2 font-light transition-all text-opacity-40 text-black h-full flex items-center">
                                  Title
                                </div>
                                <input
                                  class="border-b border-slate-400 outline-none hover:border-slate-400 focus:border-slate-600 transition-all bg-inherit border-opacity-30 px-2 py-1"
                                  id={linkTitleId}
                                  type="text"
                                  placeholder=""
                                  onInput={(e) => {
                                    global.searchGlobalLinksByTitle(
                                      e.target.value,
                                    )
                                  }}
                                  value={link.title}
                                />
                              </div> */}
                              {/* <div class="flex w-full">
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
                                    class="border-b border-slate-400 hover:border-slate-400 focus:border-slate-600 outline-none transition-all border-opacity-30 bg-inherit px-2 py-1 w-full"
                                    type="text"
                                    id={linkUrlId}
                                    placeholder="URL"
                                    value={link.title}
                                  />
                                </div>
                              </div> */}
                            </div>
                            <div class="flex gap-5 dark:text-white flex-col items-end text-[14px] opacity-50">
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
                        </Motion.div>
                      )
                    }}
                  </For>
                </div>

                <div class="w-full p-4">
                  {(() => {
                    const search_state = createSearchState(() =>
                      topic.currentTopicGlobalLinksSearch(),
                    )

                    return (
                      <Search
                        placeholder={
                          "Search URL title of global links for the topic to add a new link"
                        }
                        state={search_state}
                      />
                    )
                  })()}
                  {/* <div
                    class="bg-[#3B5CCC] text-white text-[14px] p-2 px-4 rounded-[6px] flex justify-center items-center cursor-pointer hover:bg-[#3554b9] transition-all"
                    onClick={() => {
                      // editedGuide.addLinkToSection(0, {
                      //   title: "",
                      //   url: "",
                      // })
                    }}
                  >
                    Add link
                  </div> */}
                </div>
              </Motion.div>
            )
          }}
        </For>
      </div>
    </>
  )
}
