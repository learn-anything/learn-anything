import StarterKit from "@tiptap/starter-kit"
import { For, Show, createSignal, untrack } from "solid-js"
import { useNavigate } from "solid-start"
import { createTiptapEditor } from "solid-tiptap"
import toast, { Toaster } from "solid-toast"
import { parseURL } from "ufo"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import { ui } from "@la/shared"
import {
  createDraggable,
  createDroppable,
  useDragDropContext
} from "@thisbeyond/solid-dnd"
import { useUser } from "../../GlobalContext/user"
import GlobalLinkEditModal from "../GlobalLinkEditModal"

export default function EditGlobalGuide() {
  const topic = useGlobalTopic()
  const user = useUser()
  const navigate = useNavigate()

  const [linkIdToEdit, setLinkToEdit] = createSignal("")
  const [sectionOfLinkEdited, setSectionOfLinkEdited] = createSignal("")

  const [urlToAdd, setUrlToAdd] = createSignal("")
  const [container, setContainer] = createSignal<HTMLDivElement>()
  const [showCantEditGuideModal, setShowCantEditGuideModal] =
    createSignal(false)

  const editor = createTiptapEditor(() => ({
    element: container()!,
    extensions: [StarterKit],
    content: untrack(() => {
      const cleanHtml = topic.globalTopic.topicSummary.replace(
        /<a href="(.*?)">(.*?)<\/a>/g,
        "[$2]($1)"
      )
      return cleanHtml
    }),
    editorProps: {
      attributes: {
        class: "focus:outline-none"
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      topic.set("topicSummary", html)
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
        <Show when={showCantEditGuideModal()}>
          <ui.ModalWithMessageAndButton
            message="Ability to edit personal and global guides will be coming soon 😻"
            buttonText="Join Discord to test beta version out"
            buttonAction={() => {
              window.open("https://discord.com/invite/bxtD8x6aNF")
            }}
            onClose={() => {
              setShowCantEditGuideModal(false)
            }}
          />
        </Show>

        <div class="flex-between ">
          <div
            class="border-[#696969] dark:border-gray-200 dark:hover:bg-gray-200 dark:hover:text-black border p-[4px] px-[8px] text-[12px] rounded-[4px] text-[#696969] dark:text-white font-light hover:bg-gray-300 hover:bg-opacity-50 cursor-pointer transition-all"
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
              if (!user.user.admin) {
                setShowCantEditGuideModal(true)
                return
              }
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

              const query = `
              mutation InternalUpdateLatestGlobalGuide($topicName: String!, $topicSummary: String!, $sections: [section!]!) {
                internalUpdateLatestGlobalGuide(topicName: $topicName, topicSummary: $topicSummary, sections: $sections)
              }
              `
              // TODO: hacky but works for now. removes /edit from the end of the url
              const actualTopicName = topic.globalTopic.name.replace(
                /\/edit$/,
                ""
              )
              const variables = {
                topicName: actualTopicName,
                topicSummary: topic.globalTopic.topicSummary,
                sections: sectionsToAdd
              }
              const res = await fetch(import.meta.env.VITE_GRAFBASE_API_URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${
                    import.meta.env.VITE_GRAFBASE_INTERNAL_SECRET
                  }`
                },
                body: JSON.stringify({
                  query,
                  variables
                })
              })
              console.log(res, "res")
              if (res.ok) {
                let url = window.location.href
                const parts = url.split("/")
                if (parts.length >= 4) {
                  url = "/" + parts[3]
                }
                navigate(url)
              } else {
                toast("Error saving guide")
              }

              // TODO: issue with mobius, something about it not escaping strings properly
              // const res = await mobius.mutate({
              //   updateLatestGlobalGuide: {
              //     where: {
              //       topicSummary: topic.globalTopic.topicSummary,
              //       topicName: topic.globalTopic.name,
              //       sections: sectionsToAdd
              //     },
              //     select: true
              //   }
              // })
            }}
            class="hover:bg-[#3B5CCC] text-[#3B5CCC] hover:text-white border-[#3B5CCC] border px-[8px] p-[4px] text-[12px] rounded-[4px] font-light cursor-pointer"
          >
            {/* TODO: do <Icon name="Loading" /> when making a request and waiting for response from grafbase */}
            {/* how to do it? */}
            Submit Changes
          </div>
        </div>
        <div class="border-[0.5px] dark:border-[#282828] border-[#69696951] flex flex-col gap-2 rounded-[4px] w-full">
          <div class="flex-between">
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
          class="hover:bg-[#3B5CCC] hover:text-white p-[10px] rounded-[4px] flex-center cursor-pointer text-[#3B5CCC] border border-[#3B5CCC] transition-all"
          onClick={() => {
            topic.set("latestGlobalGuide", "sections", (p) => [
              {
                summary: "",
                title: "",
                links: []
              },
              ...p
            ])
          }}
        >
          Add section
        </div>
        <For each={topic.globalTopic.latestGlobalGuide.sections}>
          {(section, sectionIndex) => {
            const [container, setContainer] = createSignal<HTMLDivElement>()

            const editor = createTiptapEditor(() => ({
              element: container()!,
              extensions: [StarterKit],
              content: untrack(() => {
                const cleanHtml =
                  topic.globalTopic.latestGlobalGuide.sections
                    .find((s) => s.title === section.title)
                    ?.summary?.replace(
                      /<a href="(.*?)">(.*?)<\/a>/g,
                      "[$2]($1)"
                    ) ?? ""
                return cleanHtml
              }),
              editorProps: {
                attributes: {
                  class: "focus:outline-none prose"
                }
              },
              onUpdate: ({ editor }) => {
                const html = editor.getHTML()
                topic.set(
                  "latestGlobalGuide",
                  "sections",
                  sectionIndex(),
                  "summary",
                  html
                )
              }
            }))

            return (
              <div class="border-[0.5px] dark:bg-neutral-900 bg-white dark:border-[#282828] border-[#69696951] rounded-lg flex flex-col">
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
                      if (!user.user.admin) {
                        setShowCantEditGuideModal(true)
                        return
                      }
                      topic.set("latestGlobalGuide", "sections", (p) => {
                        const copy = [...p]
                        copy.splice(sectionIndex(), 1)
                        return copy
                      })
                    }}
                    class="hover:text-white flex-center transition-all text-[12px] border-red-500 border text-red-500 hover:bg-red-600 border-opacity-50 rounded-[6px] p-2 w-[120px] cursor-pointer"
                  >
                    Delete section
                  </div>
                </div>
                <div class="w-full p-4" ref={setContainer} />

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
                          class="flex-between dark:bg-neutral-900 bg-white gap-6 border-y-[0.5px]  p-2 px-4 dark:border-[#282828]"
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
                          <div class="w-full  h-full flex-between">
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
                                  if (!user.user.admin) {
                                    setShowCantEditGuideModal(true)
                                    return
                                  }
                                  setLinkToEdit(link.id)
                                  setSectionOfLinkEdited(section.title)
                                }}
                                class="cursor-pointer"
                              >
                                Edit
                              </div>
                              <div
                                onClick={() => {
                                  if (!user.user.admin) {
                                    setShowCantEditGuideModal(true)
                                    return
                                  }
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

                <div class="w-full p-4 gap-2 flex flex-col">
                  {(() => {
                    const search_state = ui.createSearchState({
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
                      <ui.Search
                        placeholder={
                          "Search URL title of global links for the topic to add a new link"
                        }
                        state={search_state}
                      />
                    )
                  })()}
                  <input
                    type="text"
                    placeholder="Enter URL to add directly"
                    value={urlToAdd()}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        if (!user.user.admin) {
                          setShowCantEditGuideModal(true)
                          return
                        }
                        const [urlWithoutProtocol, _] =
                          splitUrlByProtocol(urlToAdd())

                        const query = `
                        mutation InternalAddGlobalLinkToSection($linkUrl: String!, $topicName: String!, $sectionName: String!) {
                          internalAddGlobalLinkToSection(linkUrl: $linkUrl, topicName: $topicName, sectionName: $sectionName)
                        }
                        `
                        const actualTopicName = topic.globalTopic.name.replace(
                          /\/edit$/,
                          ""
                        )
                        const variables = {
                          linkUrl: urlWithoutProtocol,
                          topicName: actualTopicName,
                          sectionName: section.title
                        }
                        const res = await fetch(
                          import.meta.env.VITE_GRAFBASE_API_URL,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${
                                import.meta.env.VITE_GRAFBASE_INTERNAL_SECRET
                              }`
                            },
                            body: JSON.stringify({
                              query,
                              variables
                            })
                          }
                        )
                        console.log(res, "res")
                        toast("Link added")
                      }
                    }}
                    onInput={(e) => {
                      setUrlToAdd(e.target.value)
                    }}
                    class=" bg-inherit text-[26px] outline-none w-full px-2 font-bold tracking-wide opacity-50 hover:opacity-70 focus:opacity-100  transition-all rounded-[4px] p-1 "
                  />
                </div>
              </div>
            )
          }}
        </For>
        <Toaster />
      </div>
    </>
  )
}

// TODO: it's same function as in grafbase/lib/util
// make it shared across the monorepo!
function splitUrlByProtocol(url: string) {
  const parsedUrl = parseURL(url)
  let host = parsedUrl.host
  if (host?.includes("www")) {
    host = host?.replace("www.", "")
  }
  let urlWithoutProtocol = host + parsedUrl.pathname + parsedUrl.search

  let protocol = parsedUrl.protocol
  if (protocol) {
    protocol = protocol.replace(":", "")
  }

  urlWithoutProtocol = removeTrailingSlash(urlWithoutProtocol)
  return [urlWithoutProtocol, protocol]
}

// TODO: same for this function
function removeTrailingSlash(str: string) {
  if (str.endsWith("/")) {
    return str.slice(0, -1)
  }
  return str
}
