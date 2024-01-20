import { ui } from "@la/shared"
import { isSignedIn, parseResponse } from "@la/shared/lib"
import clsx from "clsx"
import { Show, createEffect, createMemo, createSignal } from "solid-js"
import { useNavigate } from "solid-start"
import { useGlobalState } from "../../GlobalContext/global"
import { useUser } from "../../GlobalContext/user"
import { useMobius } from "../../root"

interface Props {
  title: string
  id: string
  url: string
  protocol: string
  year: string | null
  description: string | null
  personalLinkId: string
  // progressState?: "Bookmark" | "InProgress" | "Completed" | null
  // liked: boolean
}

// TODO: there is nicer way to do this, improve
export default function GlobalGuideLink(props: Props) {
  const mobius = useMobius()
  const user = useUser()
  const global = useGlobalState()
  const navigate = useNavigate()
  const [expandedLink, setExpandedLink] = createSignal(false)
  const [linkStatusChanging, setLinkStatusChanging] = createSignal()

  const progressState = createMemo(() => {
    const bookmarked = user.user.linksBookmarked?.some(
      (link) => link.globalLink.id === props.id
    )
    let inProgress
    let completed
    if (!bookmarked) {
      inProgress = user.user.linksInProgress?.some(
        (link) => link.globalLink.id === props.id
      )
    }
    if (!bookmarked && !inProgress) {
      completed = user.user.linksCompleted?.some(
        (link) => link.globalLink.id === props.id
      )
    }
    return bookmarked
      ? "Bookmark"
      : inProgress
        ? "InProgress"
        : completed
          ? "Completed"
          : null
  })
  const liked = createMemo(() => {
    return user.user.linksLiked?.some((link) => link.globalLink.id === props.id)
  })

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
                    if (progressState() === "Bookmark") {
                      const res = await mobius.mutate({
                        updatePersonalLinkStatus: {
                          where: {
                            action: "removeProgress",
                            personalLinkId: props.id
                          },
                          select: true
                        }
                      })
                      const [data] = parseResponse(res)
                      if (data) {
                        user.set(
                          "linksBookmarked",
                          user.user.linksBookmarked
                            ? user.user.linksBookmarked.filter(
                                (link) => link.globalLink.id !== props.id
                              )
                            : []
                        )
                      }
                    } else {
                      const res = await mobius.mutate({
                        updatePersonalLinkStatus: {
                          where: {
                            action: "bookmark",
                            personalLinkId: props.personalLinkId
                          },
                          select: true
                        }
                      })
                      const [data] = parseResponse(res)
                      if (data) {
                        user.set("linksBookmarked", [
                          ...(user.user.linksBookmarked || []),
                          {
                            id: props.personalLinkId,
                            title: props.title,
                            description: props.description,
                            globalLink: {
                              id: props.id,
                              title: props.title,
                              description: props.description,
                              url: props.url,
                              year: props.year
                            },
                            mainTopic: {
                              name: "",
                              prettyName: ""
                            }
                          }
                        ])
                        // TODO: can avoid doing below after updating `likeOrUnlikeGlobalLink` in global-link.ts (there is todo: there)
                        user.set(
                          "linksInProgress",
                          user.user.linksInProgress?.filter(
                            (link) => link.globalLink.id !== props.id
                          )
                        )
                        user.set(
                          "linksCompleted",
                          user.user.linksCompleted?.filter(
                            (link) => link.globalLink.id !== props.id
                          )
                        )
                      }
                    }
                    setLinkStatusChanging(null)
                  }}
                  class={clsx(
                    "sm:hidden animate-[iconSlide_0.8s_ease-out_forwards] cursor-pointer rounded-[4px] active:scale-[1.2] active:bg-blue-500 hover:[&>*]:scale-[0.9] transition-all h-[26px] w-[26px] border-light dark:border-dark",
                    user.user.linksBookmarked?.some(
                      (link) => link.globalLink.id === props.id
                    ) && "bg-blue-500 border-none transition-all !flex-center"
                  )}
                >
                  <Show
                    when={linkStatusChanging() === "Bookmark"}
                    fallback={
                      <ui.Icon
                        name="Bookmark"
                        fill="white"
                        // border={
                        //   props.progressState === "Bookmark" ? "red" : "black"
                        // }
                        border={
                          user.user.linksBookmarked?.some(
                            (link) => link.globalLink.id === props.id
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
                    setLinkStatusChanging("InProgress")
                    if (progressState() === "InProgress") {
                      const res = await mobius.mutate({
                        updatePersonalLinkStatus: {
                          where: {
                            action: "removeProgress",
                            personalLinkId: props.personalLinkId
                          },
                          select: true
                        }
                      })
                      const [data] = parseResponse(res)
                      if (data) {
                        user.set(
                          "linksInProgress",
                          user.user.linksInProgress
                            ? user.user.linksInProgress.filter(
                                (link) => link.globalLink.id !== props.id
                              )
                            : []
                        )
                      }
                    } else {
                      const res = await mobius.mutate({
                        updatePersonalLinkStatus: {
                          where: {
                            action: "inProgress",
                            personalLinkId: props.personalLinkId
                          },
                          select: true
                        }
                      })
                      const [data] = parseResponse(res)
                      console.log(data, "data")
                      if (data) {
                        user.set("linksInProgress", [
                          ...(user.user.linksInProgress || []),
                          {
                            id: props.personalLinkId,
                            title: null,
                            description: null,
                            mainTopic: null,
                            globalLink: {
                              id: props.id,
                              title: props.title,
                              description: props.description,
                              url: props.url,
                              year: props.year
                            }
                          }
                        ])
                        user.set(
                          "linksBookmarked",
                          user.user.linksBookmarked?.filter(
                            (link) => link.globalLink.id !== props.id
                          )
                        )
                        user.set(
                          "linksCompleted",
                          user.user.linksCompleted?.filter(
                            (link) => link.globalLink.id !== props.id
                          )
                        )
                      }
                    }
                    setLinkStatusChanging(null)
                  }}
                  class={clsx(
                    "sm:hidden cursor-pointer animate-[iconSlide_0.6s_ease-out_forwards] rounded-[4px] active:bg-blue-500 hover:opacity-50 transition-all h-[26px] w-[26px] border-light dark:border-dark ",
                    user.user.linksInProgress?.some(
                      (link) => link.globalLink.id === props.id
                    ) && "bg-blue-500 border-none transition-all !flex-center"
                  )}
                >
                  <Show
                    when={linkStatusChanging() === "InProgress"}
                    fallback={
                      <ui.Icon
                        name="Hourglass"
                        fill="white"
                        border={
                          user.user.linksBookmarked?.some(
                            (link) => link.globalLink.id === props.id
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
              <ui.ToolTip label="Completed">
                <div
                  onClick={async () => {
                    if (!isSignedIn(navigate)) return
                    setLinkStatusChanging("Completed")
                    if (progressState() === "Completed") {
                      const res = await mobius.mutate({
                        updatePersonalLinkStatus: {
                          where: {
                            action: "removeProgress",
                            personalLinkId: props.id
                          },
                          select: true
                        }
                      })
                      const [data] = parseResponse(res)
                      if (data) {
                        user.set(
                          "linksCompleted",
                          user.user.linksCompleted
                            ? user.user.linksCompleted.filter(
                                (link) => link.globalLink.id !== props.id
                              )
                            : []
                        )
                      }
                    } else {
                      const res = await mobius.mutate({
                        updatePersonalLinkStatus: {
                          where: {
                            action: "complete",
                            personalLinkId: props.id
                          },
                          select: true
                        }
                      })
                      const [data] = parseResponse(res)
                      if (data) {
                        user.set("linksCompleted", [
                          ...(user.user.linksCompleted || []),
                          {
                            id: props.id,
                            title: props.title,
                            description: props.description,
                            url: props.url,
                            year: props.year
                          }
                        ])
                        user.set(
                          "linksInProgress",
                          user.user.linksInProgress?.filter(
                            (link) => link.globalLink.id !== props.id
                          )
                        )
                        user.set(
                          "linksBookmarked",
                          user.user.linksCompleted?.filter(
                            (link) => link.globalLink.id !== props.id
                          )
                        )
                      }
                    }
                    setLinkStatusChanging(null)
                  }}
                  class={clsx(
                    "sm:hidden cursor-pointer rounded-[4px] animate-[iconSlide_0.4s_ease-out_forwards] active:scale-[1.2] active:bg-blue-500 hover:[&>*]:scale-[0.9] transition-all h-[26px] w-[26px] border-light dark:border-dark",
                    user.user.linksCompleted?.some(
                      (link) => link.globalLink.id === props.id
                    ) && "bg-blue-500 bg-opacity border-none !flex-center"
                  )}
                >
                  <Show
                    when={linkStatusChanging() === "Completed"}
                    fallback={
                      <ui.Icon
                        name="Checkmark"
                        border={
                          user.user.linksCompleted?.some(
                            (link) => link.globalLink.id === props.id
                          )
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
              <ui.ToolTip label="Liked">
                <div
                  onClick={async () => {
                    if (!isSignedIn(navigate)) return
                    setLinkStatusChanging("Liked")
                    if (liked()) {
                      const res = await mobius.mutate({
                        updatePersonalLinkStatus: {
                          where: {
                            action: "unlike",
                            personalLinkId: props.id
                          },
                          select: true
                        }
                      })
                      const [data] = parseResponse(res)
                      if (data) {
                        user.set(
                          "linksLiked",
                          user.user.linksLiked
                            ? user.user.linksLiked.filter(
                                (link) => link.globalLink.id !== props.id
                              )
                            : []
                        )
                      }
                    } else {
                      const res = await mobius.mutate({
                        updatePersonalLinkStatus: {
                          where: {
                            action: "like",
                            personalLinkId: props.id
                          },
                          select: true
                        }
                      })
                      const [data] = parseResponse(res)
                      if (data) {
                        user.set("linksLiked", [
                          ...(user.user.linksLiked || []),
                          {
                            id: props.id,
                            title: props.title,
                            description: props.description,
                            url: props.url,
                            year: props.year
                          }
                        ])
                      }
                    }
                    setLinkStatusChanging(null)
                  }}
                  class={clsx(
                    "sm:hidden cursor-pointer rounded-[4px] animate-[iconSlide_0.2s_ease-out_forwards] hover:opacity-50 transition-all h-[26px] w-[26px] border-light dark:border-dark",
                    user.user.linksLiked?.some(
                      (link) => link.globalLink.id === props.id
                    ) && "bg-red-500 border-none transition-all !flex-center"
                  )}
                >
                  <Show
                    when={linkStatusChanging() === "Liked"}
                    fallback={
                      <ui.Icon
                        name="Heart"
                        fill="white"
                        border={
                          user.user.linksLiked?.some(
                            (link) => link.globalLink.id === props.id
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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
