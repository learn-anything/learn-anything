import { ui } from "@la/shared"
import clsx from "clsx"
import { Show } from "solid-js"
import { useUser } from "../../GlobalContext/user"
import { useMobius } from "../../root"

interface Props {
  title: string
  id: string
  url: string
  protocol: string
  year?: string
  description?: string
}

// TODO: essentially same as GlobalGuideLink but it was tricky to make it work into one component
// it should be one component though. big change is that `likedLinkIds` and `completedLinkIds` should not be
// on global topic..
export default function ProfileGuideLink(props: Props) {
  const mobius = useMobius()
  const user = useUser()

  return (
    <div class="flex-between overflow-hidden dark:border-dark border-light p-4 px-4 ">
      <div class="w-full  h-full flex-between">
        <div class={clsx("w-fit flex-col", props.description && "gap-1")}>
          <div class="flex gap-3 items-center">
            <ui.Icon name="Verified" />
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
        </div>
        <div class="flex items-center gap-[34px]">
          <div class="gap-4 flex ">
            <div
              onClick={async () => {
                if (
                  user.user.linksLiked?.some((link) => link.id === props.id)
                ) {
                  user.set(
                    "linksLiked",
                    user.user.linksLiked.filter((link) => link.id !== props.id)
                  )
                  const res = await mobius.mutate({
                    updateGlobalLinkStatus: {
                      where: {
                        action: "unlike",
                        globalLinkId: props.id
                      },
                      select: true
                    }
                  })
                  console.log(res, "res")
                } else {
                  user.set("linksLiked", [
                    ...(user.user.linksLiked || []),
                    {
                      id: props.id,
                      title: props.title,
                      url: props.url,
                      description: props.description,
                      year: props.year
                    }
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
                user.user.linksLiked?.some((link) => link.id === props.id) &&
                  "bg-red-500 border-none transition-all"
              )}
            >
              <ui.Icon
                name="Heart"
                fill="white"
                border={
                  user.user.linksLiked?.some((link) => link.id === props.id)
                    ? "red"
                    : "black"
                }
              />
            </div>
            {/* <div
              onClick={async () => {
                if (
                  user.user.completedLinks.some((link) => link.id === props.id)
                ) {
                  user.set(
                    "completedLinks",
                    user.user.completedLinks.filter(
                      (link) => link.id !== props.id
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
                  user.set("completedLinks", [
                    ...user.user.completedLinks,
                    {
                      id: props.id,
                      title: props.title,
                      url: props.url,
                      description: props.description,
                      year: props.year
                    }
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
                user.user.completedLinks.some((link) => link.id === props.id) &&
                  "bg-blue-500 bg-opacity border-none"
              )}
            >
              <ui.Icon
                name="Checkmark"
                border={
                  user.user.completedLinks.some((link) => link.id === props.id)
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
