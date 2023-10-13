import { For, Show, createSignal, untrack } from "solid-js"
import { useNavigate } from "solid-start"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import { useMobius } from "../../root"
import { debounce } from "@solid-primitives/scheduled"
import { createTiptapEditor } from "solid-tiptap"
import StarterKit from "@tiptap/starter-kit"
import { Search, createSearchState } from "../Search"
// @ts-ignore
import {
  createDraggable,
  createDroppable,
  useDragDropContext
} from "@thisbeyond/solid-dnd"
import GlobalLinkEditModal from "../GlobalLinkEditModal"

export default function GuideSummaryEdit() {
  const topic = useGlobalTopic()
  const mobius = useMobius()
  const navigate = useNavigate()

  const [linkIdToEdit, setLinkToEdit] = createSignal("")
  const [sectionOfLinkEdited, setSectionOfLinkEdited] = createSignal("")
  const [container, setContainer] = createSignal<HTMLDivElement>()

  const editor = createTiptapEditor(() => ({
    element: container()!,
    extensions: [StarterKit],
    content: untrack(() => topic.globalTopic.topicSummary),
    editorProps: {
      attributes: {
        class: "focus:outline-none prose"
      }
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      console.log(json)

      // TODO: support multi line. be type safe
      // for now this only works on one line
      // @ts-ignore
      const topicSummary = json.content[0]?.content[0]?.text
      console.log(topicSummary)

      // TODO: breaks focus.. find another way to update
      topic.set("topicSummary", topicSummary!)

      // const triggerUpdate = debounce(() => {
      //   topic.set("topicSummary", topicSummary!)
      // }, 3000)
      // triggerUpdate()
    }
  }))

  const [, { onDragEnd }] = useDragDropContext()!

  onDragEnd(({ draggable, droppable }) => {
    if (!droppable) return

    const sections = topic.globalTopic.latestGlobalGuide.sections

    let parts = (droppable.id as string).split("-in-section-")
    const droppedIntoLinkTitle = parts[0]!
    const sectionTitle = parts[1]!
    parts = (draggable.id as string).split("-in-section-")
    const linkBeingDroppedTitle = parts[0]!

    const section_idx = sections.findIndex((s) => s.title === sectionTitle)
    if (section_idx === -1) return

    const section = sections[section_idx]!

    const dragged_idx = section.links.findIndex(
      (link) => link.title === linkBeingDroppedTitle
    )
    const dropped_idx = section.links.findIndex(
      (link) => link.title === droppedIntoLinkTitle
    )
    if (dragged_idx === -1 || dropped_idx === -1) return

    topic.set("latestGlobalGuide", "sections", section_idx, "links", (p) => {
      const copy = [...p]
      /*
        Swap indexes
      */
      ;[copy[dragged_idx], copy[dropped_idx]] = [
        copy[dropped_idx]!,
        copy[dragged_idx]!
      ]
      return copy
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
            onClick={async () => {
              // TODO: check all data is valid, if not, show error with what is the problem
              // TODO: after data validation, send grafbase mutation to update global topic

              const transformSection = (originalSection: any): any => {
                return {
                  title: originalSection.title,
                  summary: originalSection.summary,
                  linkIds: originalSection.links.map((link: any) => link.id)
                }
              }

              const sectionsToAdd =
                topic.globalTopic.latestGlobalGuide.sections.map(
                  transformSection
                )
              // console.log(sectionsToAdd, "sections to add")

              const res = await mobius.mutate({
                updateLatestGlobalGuide: {
                  where: {
                    topicSummary: topic.globalTopic.topicSummary,
                    topicName: topic.globalTopic.name,
                    sections: sectionsToAdd
                  },
                  select: true
                }
              })
              console.log(res, "res")
            }}
            class="bg-[#3B5CCC] text-white border-[#3B5CCC] border px-[10px] p-[8px] rounded-[4px] font-light cursor-pointer"
          >
            {/* TODO: do <Icon name="Loading" /> when making a request and waiting for response from grafbase */}
            {/* how to do it? */}
            Submit Changes
          </div>
        </div>
        <div class="border-[1px] dark:border-[#282828] border-[#69696951] flex flex-col gap-2 rounded-[4px] w-full">
          <div class="flex justify-between items-center">
            <div class="w-full p-4" ref={setContainer} />
            <div class="text-[#3B5CCC] cursor-pointer select-none"></div>
          </div>
          {/* <Show
            when={editedGuideOld.guide.summary.length > 0}
            fallback={
              <input
                class="text-[#696969] bg-inherit font-light overflow-hidden text-ellipsis outline-none"
                id="GuideSummary"
                placeholder="Add summary"
                value={topic.globalTopic.topicSummary}
                onInput={(e) => {
                  topic.set("topicSummary", e.target.value)
                }}
              />
            }
          >
            <div
              class="text-[#696969] font-light overflow-hidden text-ellipsis outline-none"
              id="GuideSummary"
              // onClick={() => {}}
            >
              {editedGuideOld.guide.summary}
            </div>
          </Show> */}
        </div>
        <div
          class="bg-[#3B5CCC] text-white p-3 rounded-[4px] flex justify-center items-center cursor-pointer hover:bg-[#3554b9] transition-all"
          onClick={() => {
            topic.set("latestGlobalGuide", "sections", (p) => [
              ...p,
              {
                summary: "",
                title: "",
                links: []
              }
            ])
          }}
        >
          Add section
        </div>
        <For each={topic.globalTopic.latestGlobalGuide.sections}>
          {(section, sectionIndex) => {
            let ref!: HTMLDivElement

            const editor = createTiptapEditor(() => ({
              element: ref!,
              extensions: [StarterKit],
              content: `Summary`,
              editorProps: {
                attributes: {
                  class: "focus:outline-none prose"
                }
              }
            }))

            return (
              <div class="border dark:bg-neutral-900 bg-white border-[#282828] rounded-lg flex flex-col">
                <div class="flex w-full p-4">
                  <input
                    class="text-[#696969] w-full bg-transparent  font-light overflow-hidden text-ellipsis outline-none"
                    onInput={(e) => {
                      topic.set(
                        "latestGlobalGuide",
                        "sections",
                        sectionIndex(),
                        "title",
                        e.target.value
                      )
                    }}
                    value={section.title}
                  />
                  <div
                    onClick={() => {
                      topic.set("latestGlobalGuide", "sections", (p) => {
                        const copy = [...p]
                        copy.splice(sectionIndex(), 1)
                        return copy
                      })
                    }}
                    class="hover:text-white flex items-center justify-center border-red-500 border text-red-500 hover:bg-red-600 border-opacity-50 rounded-[6px] p-2 w-[180px] cursor-pointer"
                  >
                    Delete section
                  </div>
                </div>
                <div class="w-full p-4" id="editor" ref={ref} />

                <div class="flex flex-col">
                  <For each={section.links}>
                    {(link, linkIndex) => {
                      const draggable = createDraggable(
                        `${link.title}-in-section-${section.title}`
                      )
                      const droppable = createDroppable(
                        `${link.title}-in-section-${section.title}`
                      )
                      const linkUrlId = `${section.title}-link-url-${linkIndex}`
                      return (
                        <div
                          ref={(el) => {
                            draggable(el)
                            droppable(el)
                          }}
                          class="flex items-center dark:bg-neutral-900 bg-white gap-6 justify-between border-y  p-2 px-4 border-[#282828]"
                        >
                          <Show
                            when={
                              linkIdToEdit() === link.id &&
                              sectionOfLinkEdited() === section.title
                            }
                          >
                            <GlobalLinkEditModal
                              linkId={linkIdToEdit()}
                              onClose={() => {
                                setLinkToEdit("")
                                setSectionOfLinkEdited("")
                              }}
                            />
                          </Show>
                          <div class="w-full  h-full flex justify-between items-center">
                            <div class="w-[80%] gap-1 flex flex-col ">
                              <div class="relative flex flex-col text-[#3B5CCC] dark:text-blue-400">
                                <div class="text-[16px] w-full outline-none transition-all bg-inherit px-2 py-1">
                                  {link.title}
                                </div>
                              </div>
                              <div class="flex w-full">
                                <Show when={link.year}>
                                  <div class="font-light text-[12px] text-[#696969] px-2">
                                    {link.year}
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
                            <div class="flex gap-1 dark:text-white flex-col items-end text-[14px] opacity-50">
                              <div
                                onClick={async () => {
                                  // navigate(`/links/${link.id}`)
                                  setLinkToEdit(link.id)
                                  setSectionOfLinkEdited(section.title)
                                }}
                                class="cursor-pointer"
                              >
                                Edit
                              </div>
                              <div
                                onClick={() => {
                                  topic.set(
                                    "latestGlobalGuide",
                                    "sections",
                                    sectionIndex(),
                                    "links",
                                    (p) => {
                                      const copy = [...p]
                                      copy.splice(linkIndex(), 1)
                                      return copy
                                    }
                                  )
                                }}
                                class="cursor-pointer"
                              >
                                Delete
                              </div>
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
                        const linkToAdd = topic.globalTopic.links.find(
                          (link) => link.title === name
                        )
                        if (!linkToAdd) return

                        topic.set(
                          "latestGlobalGuide",
                          "sections",
                          sectionIndex(),
                          "links",
                          (p) => [...p, { ...linkToAdd }]
                        )
                      }
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
