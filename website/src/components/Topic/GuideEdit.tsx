import { For, Show, createEffect, createSignal, untrack } from "solid-js"
import { useEditGuide } from "../../GlobalContext/edit-guide"
import { useMobius } from "../../root"
import { Search, createSearchState } from "../Search"
import { useNavigate } from "solid-start"
import { GlobalTopic, useGlobalTopic } from "../../GlobalContext/global-topic"
import {
  useDragDropContext,
  createDraggable,
  createDroppable,
} from "@thisbeyond/solid-dnd"

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
    topicSummary: "",
  })

  // @ts-ignore
  const [, { onDragEnd }] = useDragDropContext()

  onDragEnd(({ draggable, droppable }) => {
    if (droppable) {
      let parts = droppable.id.split("-in-section-")
      const droppedIntoLinkTitle = parts[0]
      const sectionTitle = parts[1]
      parts = draggable.id.split("-in-section-")
      const linkBeingDroppedTitle = parts[0]

      // @ts-ignore
      const linkToAdd = topic.globalTopic.links.find(
        (link) => link.title === linkBeingDroppedTitle,
      )

      console.log(linkToAdd, "link to add")
      // @ts-ignore
      const foundSectionIndex =
        topic.globalTopic.latestGlobalGuide?.sections.findIndex((s) => {
          return s.title === sectionTitle
        })

      if (foundSectionIndex !== -1 && foundSectionIndex !== undefined) {
        let copiedTopic: GlobalTopic = JSON.parse(
          JSON.stringify(editedGlobalTopic()),
        )

        const targetSection =
          copiedTopic.latestGlobalGuide?.sections[foundSectionIndex]

        if (targetSection) {
          // 2. Within this section's links array, find the index of the link corresponding to droppedIntoLinkTitle.
          const dropPosition = targetSection.links.findIndex(
            (link) => link.title === droppedIntoLinkTitle,
          )

          if (dropPosition !== -1) {
            // 3. Insert linkToAdd after this index.
            targetSection.links.splice(dropPosition + 1, 0, linkToAdd)
          }
        }

        // @ts-ignore
        // copiedTopic.latestGlobalGuide?.sections[
        //   foundSectionIndex
        //   // @ts-ignore
        // ].links.push(linkToAdd)

        setEditedGlobalTopic(copiedTopic)
      }
    }
  })

  createEffect(() => {
    if (topic.globalTopic.latestGlobalGuide) {
      untrack(() => {
        setEditedGlobalTopic(topic.globalTopic)
      })
    }
  })

  // createEffect(() => {
  //   console.log(editedGlobalTopic(), "edited global topic")
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
          <div
            class="border-[#696969] dark:border-gray-200 dark:hover:bg-gray-200 dark:hover:text-black border p-[8px] px-[10px] rounded-[4px] text-[#696969] dark:text-white font-light hover:bg-gray-300 hover:bg-opacity-50 cursor-pointer transition-all"
            onClick={() => {
              // TODO: if there is modified data, ask user if it's ok to disregard made changes to go back
              let url = window.location.href
              const parts = url.split("/")
              if (parts.length >= 4) {
                url = "/" + parts[3]
              }
              navigate(url)
            }}
          >
            Cancel
          </div>
          <div
            onClick={() => {
              console.log(
                editedGlobalTopic(),
                "edited global topic to send as mutation",
              )
              // TODO: check all data is valid, if not, show error with what is the problem
              // TODO: after data validation, send grafbase mutation to update global topic
              // await mobius.mutation
            }}
            class="bg-[#3B5CCC] text-white border-[#3B5CCC] border px-[10px] p-[8px] rounded-[4px] font-light cursor-pointer"
          >
            Submit Changes
          </div>
        </div>
        <div class="border-[0.5px] dark:border-[#282828] border-[#69696951] flex flex-col gap-2 rounded-[4px] p-4 w-full">
          <div class="flex justify-between items-center">
            <div class="text-[#696969] ">Summary</div>
            <div
              class="text-[#3B5CCC] cursor-pointer select-none"
              // onClick={() => {}}
            ></div>
          </div>
          <Show
            when={editedGuide.guide.summary.length > 0}
            fallback={
              <input
                class="text-[#696969] bg-inherit font-light overflow-hidden text-ellipsis outline-none"
                id="GuideSummary"
                placeholder="Add summary"
                value={topic.globalTopic.topicSummary}
                onInput={(e) => {
                  const currentGlobalTopic = editedGlobalTopic()
                  setEditedGlobalTopic({
                    ...currentGlobalTopic,
                    topicSummary: e.target.value,
                  })
                }}
              />
            }
          >
            <div
              class="text-[#696969] font-light overflow-hidden text-ellipsis outline-none"
              id="GuideSummary"
              // onClick={() => {}}
            >
              {editedGuide.guide.summary}
            </div>
          </Show>
        </div>
        <div
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
        </div>
        <For each={editedGlobalTopic().latestGlobalGuide?.sections}>
          {(section) => {
            return (
              <div class="border dark:bg-neutral-900 bg-white border-slate-400 border-opacity-30 rounded-lg flex flex-col">
                <Show
                  when={section.title}
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
                      const draggable = createDraggable(
                        `${link.title}-in-section-${section.title}`,
                      )
                      const droppable = createDroppable(
                        `${link.title}-in-section-${section.title}`,
                      )
                      const linkUrlId = `${section.title}-link-url-${index}`
                      return (
                        <div
                          use:draggable
                          use:droppable
                          class="flex items-center gap-6 justify-between border-y p-6 border-slate-400 border-opacity-30"
                        >
                          <div class="w-full  h-full flex justify-between items-center">
                            <div class="w-[80%] gap-4 flex flex-col py-4">
                              <div class="relative flex flex-col text-[#3B5CCC]">
                                <div class="text-[18px] w-full outline-none transition-all bg-inherit px-2 py-1">
                                  {link.title}
                                </div>
                              </div>
                              <div class="flex w-full">
                                <Show when={link?.year}>
                                  <div class="font-light text-[12px] text-[#696969] px-2">
                                    {link?.year}
                                  </div>
                                </Show>

                                <div class="font-light w-full text-[12px] text-[#696969]">
                                  <div
                                    class="outline-none transition-all bg-inherit px-2 w-full"
                                    id={linkUrlId}
                                  >
                                    {link.url}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="flex gap-5 dark:text-white flex-col items-end text-[14px] opacity-50">
                              <div
                                onClick={async () => {
                                  console.log(link, "link")
                                  navigate(`/links/${link.id}`)
                                }}
                                class="cursor-pointer"
                              >
                                Edit
                              </div>
                              <div class="cursor-pointer">Delete</div>
                            </div>
                          </div>
                        </div>
                      )
                    }}
                  </For>
                </div>

                <div class="w-full p-4">
                  {(() => {
                    const search_state = createSearchState({
                      searchResults: topic.currentTopicGlobalLinksSearch,
                      onSelect({ name }) {
                        // @ts-ignore
                        const linkToAdd = topic.globalTopic.links.find(
                          (link) => link.title === name,
                        )
                        const foundSectionIndex =
                          topic.globalTopic.latestGlobalGuide?.sections.findIndex(
                            (s) => {
                              return s.title === section.title
                            },
                          )
                        if (
                          foundSectionIndex !== -1 &&
                          foundSectionIndex !== undefined
                        ) {
                          let copiedTopic: GlobalTopic = JSON.parse(
                            JSON.stringify(editedGlobalTopic()),
                          )
                          // @ts-ignore
                          copiedTopic.latestGlobalGuide?.sections[
                            foundSectionIndex
                            // @ts-ignore
                          ].links.push(linkToAdd)
                          setEditedGlobalTopic(copiedTopic)
                        }
                      },
                    })

                    return (
                      <Search
                        placeholder={
                          "Search URL title of global links for the topic to add a new link"
                        }
                        state={search_state}
                      />
                    )
                  })()}
                </div>
              </div>
            )
          }}
        </For>
      </div>
    </>
  )
}
