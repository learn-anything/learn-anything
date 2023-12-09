import { ui } from "@la/shared"
import { isSignedIn, parseResponse } from "@la/shared/lib"
import clsx from "clsx"
import { Show, createEffect, createSignal } from "solid-js"
import { useNavigate } from "solid-start"
import { useGlobalState } from "../../GlobalContext/global"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import { useMobius } from "../../root"

interface Props {
  title: string
  id: string
  url: string
  protocol: string
  year?: string
  description?: string
}

export default function GlobalGuideLink(props: Props) {
  const mobius = useMobius()
  const topic = useGlobalTopic()
  const global = useGlobalState()
  const navigate = useNavigate()
  const [expandedLink, setExpandedLink] = createSignal(false)
  const [linkStatusChanging, setLinkStatusChanging] = createSignal()

  createEffect(() => {
    let timeoutId: any

    const targetElement = document.getElementById(props.id)

    function handleMouseEnter() {
      clearTimeout(timeoutId) // Clear the timeout if the mouse re-enters before 1 second
    }
    function handleMouseLeave() {
      timeoutId = setTimeout(() => {
        setExpandedLink(false)
        // Your code to execute after 1 second of leaving the element
      }, 1000)
    }
    if (targetElement && expandedLink()) {
      targetElement.addEventListener("mouseenter", handleMouseEnter)
      targetElement.addEventListener("mouseleave", handleMouseLeave)
    }
  })
  return (
    <>
      <style>
        {`
        @media (min-width: 640px) {
          .GlobalGuideLink:hover #LinkIcons > * {
            display: flex;
          }
        }
      `}
      </style>
      <div
        class={clsx(
          "GlobalGuideLink flex-between overflow-hidden border-b-[0.5px] dark:border-[#282828] border-[#69696951] p-4 px-4  min-h-[60px]"
        )}
        onClick={() => {
          if (window.innerWidth < 644) {
            setExpandedLink(!expandedLink())
          }
        }}
        id={props.id}
      >
        <div class="w-full h-full flex-col sm:flex-row sm:flex-between sm:gap-10">
          <div class={clsx("w-fit flex-gap-[10px]", props.description && "")}>
            <div
              id="LinkTitle"
              class="col-gap-[4px] items-start sm:gap-3 sm:flex-row sm:items-center"
            >
              <a
                class="font-bold text-[#3B5CCC] dark:text-blue-400 cursor-pointer break-all"
                href={`${props.protocol}://${props.url}`}
              >
                {props.title}
              </a>
              <Show when={props.year}>
                <div class="font-light text-[12px] text-[#696969]">
                  {props.year}
                </div>
              </Show>
              <a
                class="font-light text-[12px] text-[#696969] text-ellipsis w-[250px] overflow-hidden whitespace-nowrap"
                href={`${props.protocol}://${props.url}`}
              >
                {props.url}
              </a>
            </div>
            <div class="flex gap-3">
              <Show when={props.description}>
                <div class="font-light text-[14px] text-white text-opacity-50">
                  {props.description}
                </div>
              </Show>
            </div>
          </div>
          <div class="flex items-center gap-[34px] relative self-end sm:self-center">
            <div
              id="LinkIcons"
              class={clsx(
                "hidden sm:!flex sm:gap-4",
                expandedLink() && "gap-4 transition-all !flex animate-iconSlide"
              )}
            >
              <ui.ToolTip label="Bookmark">
                <div
                  onClick={async () => {
                    if (!isSignedIn(navigate)) return
                    setLinkStatusChanging("Bookmark")
                    return
                    if (
                      topic.globalTopic.linksBookmarkedIds.includes(props.id)
                    ) {
                      topic.set(
                        "linksBookmarkedIds",
                        topic.globalTopic.linksBookmarkedIds.filter(
                          (id) => id !== props.id
                        )
                      )
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "removeProgress",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    } else {
                      const res = await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "bookmark",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                      const [data] = parseResponse(res)
                      if (data) {
                        // TODO: there is better way to do this..
                        topic.set("linksBookmarkedIds", [
                          ...topic.globalTopic.linksBookmarkedIds,
                          props.id
                        ])
                        topic.set(
                          "linksInProgressIds",
                          topic.globalTopic.linksInProgressIds.filter(
                            (id) => id !== props.id
                          )
                        )
                        topic.set(
                          "linksCompletedIds",
                          topic.globalTopic.linksCompletedIds.filter(
                            (id) => id !== props.id
                          )
                        )
                      }
                    }
                    setLinkStatusChanging(null)
                  }}
                  class={clsx(
                    "sm:hidden animate-[iconSlide_0.8s_ease-out_forwards] cursor-pointer rounded-[4px] active:scale-[1.2] active:bg-blue-500 hover:[&>*]:scale-[0.9] transition-all h-[26px] w-[26px] border-light dark:border-dark",
                    topic.globalTopic.linksBookmarkedIds.includes(props.id) &&
                      "bg-blue-500 border-none transition-all !flex-center"
                  )}
                >
                  <Show
                    when={linkStatusChanging() === "Bookmark"}
                    fallback={
                      <ui.Icon
                        name="Bookmark"
                        fill="white"
                        border={
                          topic.globalTopic.linksBookmarkedIds.includes(
                            props.id
                          )
                            ? "red"
                            : "black"
                        }
                      />
                    }
                  >
                    <div class="flex-center w-full h-full">
                      <ui.Icon
                        width="16"
                        height="16"
                        name="Loader"
                        border="white"
                      />
                    </div>
                  </Show>
                </div>
              </ui.ToolTip>
              <ui.ToolTip label="In Progress">
                <div
                  onClick={async () => {
                    if (!isSignedIn(navigate)) return
                    if (
                      topic.globalTopic.linksInProgressIds.includes(props.id)
                    ) {
                      topic.set(
                        "linksInProgressIds",
                        topic.globalTopic.linksInProgressIds.filter(
                          (id) => id !== props.id
                        )
                      )
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "removeProgress",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    } else {
                      // TODO: better way to do this..
                      topic.set("linksInProgressIds", [
                        ...topic.globalTopic.linksInProgressIds,
                        props.id
                      ])
                      topic.set(
                        "linksBookmarkedIds",
                        topic.globalTopic.linksBookmarkedIds.filter(
                          (id) => id !== props.id
                        )
                      )
                      topic.set(
                        "linksCompletedIds",
                        topic.globalTopic.linksCompletedIds.filter(
                          (id) => id !== props.id
                        )
                      )
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "inProgress",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    }
                  }}
                  class={clsx(
                    "sm:hidden cursor-pointer animate-[iconSlide_0.6s_ease-out_forwards] rounded-[4px] active:bg-blue-500 hover:opacity-50 transition-all h-[26px] w-[26px] border-light dark:border-dark ",
                    topic.globalTopic.linksInProgressIds.includes(props.id) &&
                      "bg-blue-500 border-none transition-all !flex-center"
                  )}
                >
                  <ui.Icon
                    name="Hourglass"
                    fill="white"
                    border={
                      topic.globalTopic.linksInProgressIds.includes(props.id)
                        ? "red"
                        : "black"
                    }
                  />
                </div>
              </ui.ToolTip>
              <ui.ToolTip label="Completed">
                <div
                  onClick={async () => {
                    if (!isSignedIn(navigate)) return
                    if (
                      topic.globalTopic.linksCompletedIds.includes(props.id)
                    ) {
                      topic.set(
                        "linksCompletedIds",
                        topic.globalTopic.linksCompletedIds.filter(
                          (id) => id !== props.id
                        )
                      )
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "removeProgress",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    } else {
                      // TODO: better way to do this..
                      topic.set("linksCompletedIds", [
                        ...topic.globalTopic.linksCompletedIds,
                        props.id
                      ])
                      topic.set(
                        "linksBookmarkedIds",
                        topic.globalTopic.linksBookmarkedIds.filter(
                          (id) => id !== props.id
                        )
                      )
                      topic.set(
                        "linksInProgressIds",
                        topic.globalTopic.linksInProgressIds.filter(
                          (id) => id !== props.id
                        )
                      )
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "complete",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    }
                  }}
                  class={clsx(
                    "sm:hidden cursor-pointer rounded-[4px] animate-[iconSlide_0.4s_ease-out_forwards] active:scale-[1.2] active:bg-blue-500 hover:[&>*]:scale-[0.9] transition-all h-[26px] w-[26px] border-light dark:border-dark",
                    topic.globalTopic.linksCompletedIds.includes(props.id) &&
                      "bg-blue-500 bg-opacity border-none !flex-center"
                  )}
                >
                  <ui.Icon
                    name="Checkmark"
                    border={
                      topic.globalTopic.linksCompletedIds.includes(props.id)
                        ? global.state.theme === "light"
                          ? "black"
                          : "white"
                        : global.state.theme === "dark"
                          ? "white"
                          : "black"
                    }
                    width="24"
                    height="24"
                  />
                </div>
              </ui.ToolTip>
              <ui.ToolTip label="Liked">
                <div
                  onClick={async () => {
                    if (!isSignedIn(navigate)) return
                    if (topic.globalTopic.linksLikedIds.includes(props.id)) {
                      topic.set(
                        "linksLikedIds",
                        topic.globalTopic.linksLikedIds.filter(
                          (id) => id !== props.id
                        )
                      )
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "unlike",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    } else {
                      topic.set("linksLikedIds", [
                        ...topic.globalTopic.linksLikedIds,
                        props.id
                      ])
                      await mobius.mutate({
                        updateGlobalLinkStatus: {
                          where: {
                            action: "like",
                            globalLinkId: props.id
                          },
                          select: true
                        }
                      })
                    }
                  }}
                  class={clsx(
                    "sm:hidden cursor-pointer rounded-[4px] animate-[iconSlide_0.2s_ease-out_forwards] hover:opacity-50 transition-all h-[26px] w-[26px] border-light dark:border-dark",
                    topic.globalTopic.linksLikedIds.includes(props.id) &&
                      "bg-red-500 border-none transition-all !flex-center"
                  )}
                >
                  <ui.Icon
                    name="Heart"
                    fill="white"
                    border={
                      topic.globalTopic.linksLikedIds.includes(props.id)
                        ? "red"
                        : "black"
                    }
                  />
                </div>
              </ui.ToolTip>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
