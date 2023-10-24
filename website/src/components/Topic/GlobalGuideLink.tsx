import clsx from "clsx"
import { Show } from "solid-js"
import { useNavigate } from "solid-start"
import { useGlobalState } from "../../GlobalContext/global"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import { useUser } from "../../GlobalContext/user"
import { useMobius } from "../../root"
import Icon from "../Icon"

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
  const user = useUser()
  const global = useGlobalState()
  const navigate = useNavigate()

  return (
    <>
      <style>
        {`
        #LinkIcons {
          flex-direction: column;

        }
        #LinkTitle {
          flex-direction: column;
          align-items: start;
        }
         @media (min-width: 700px) {
          #LinkTitle {
            flex-direction: row;
          }
          #LinkIcons {
            flex-direction: row;
          }
        }
      `}
      </style>
      <div class="flex items-center overflow-hidden  border-b-[0.5px] dark:border-[#282828]  border-[#69696951] p-4 px-4 justify-between">
        {/* <div class="">
      <div class="bg-neutral-400 w-10 h-10 rounded-full"></div>
    </div> */}
        <div class="w-full  h-full flex justify-between items-center">
          <div
            class={clsx("w-fit flex flex-col", props.description && "gap-1")}
          >
            <div id="LinkTitle" class="flex gap-3 items-center">
              <a
                class="font-bold text-[#3B5CCC] dark:text-blue-400 cursor-pointer"
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
            {/* <div class="font-light text-[12px] text-[#696969]">PDF</div> */}
          </div>
          <div class="flex items-center gap-[34px]">
            <div id="LinkIcons" class="gap-4 flex ">
              {/* TODO: change how icon looks when link is already added. activated state  */}
              {/* UI of being pressed in */}
              <div
                onClick={async () => {
                  if (!user.user.signedIn) {
                    localStorage.setItem("pageBeforeSignIn", location.pathname)
                    navigate("/auth")
                    return
                  }
                  if (!user.user.member) {
                    global.setShowMemberOnlyModal(true)
                    return
                  }
                  if (topic.globalTopic.likedLinkIds.includes(props.id)) {
                    topic.set(
                      "likedLinkIds",
                      topic.globalTopic.likedLinkIds.filter(
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
                    topic.set("likedLinkIds", [
                      ...topic.globalTopic.likedLinkIds,
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
                  "cursor-pointer rounded-[2px] flex dark:hover:bg-neutral-950 items-center hover:border-none transition-all justify-center border h-[26px] w-[26px] border-[#69696951] dark:border-[#282828]",
                  topic.globalTopic.likedLinkIds.includes(props.id) &&
                    "bg-red-500 border-none transition-all"
                )}
              >
                <Icon
                  name="Heart"
                  fill="white"
                  border={
                    topic.globalTopic.likedLinkIds.includes(props.id)
                      ? "red"
                      : "black"
                  }
                />
              </div>
              <div
                onClick={async () => {
                  if (!user.user.signedIn) {
                    localStorage.setItem("pageBeforeSignIn", location.pathname)
                    navigate("/auth")
                    return
                  }
                  if (!user.user.member) {
                    global.setShowMemberOnlyModal(true)
                    return
                  }
                  if (topic.globalTopic.completedLinkIds.includes(props.id)) {
                    topic.set(
                      "completedLinkIds",
                      topic.globalTopic.completedLinkIds.filter(
                        (id) => id !== props.id
                      )
                    )
                    await mobius.mutate({
                      updateGlobalLinkStatus: {
                        where: {
                          action: "uncomplete",
                          globalLinkId: props.id
                        },
                        select: true
                      }
                    })
                  } else {
                    topic.set("completedLinkIds", [
                      ...topic.globalTopic.completedLinkIds,
                      props.id
                    ])
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
                  "cursor-pointer rounded-[2px] dark:hover:bg-neutral-950 hover:border-none border flex items-center transition-all justify-center h-[26px] w-[26px] border-[#69696951] dark:border-[#282828]",
                  topic.globalTopic.completedLinkIds.includes(props.id) &&
                    "bg-blue-500 bg-opacity border-none"
                )}
              >
                <Icon
                  name="Checkmark"
                  border={
                    topic.globalTopic.completedLinkIds.includes(props.id)
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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
