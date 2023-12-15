import clsx from "clsx"
import { For, Show } from "solid-js"
import GlobalGuideLink from "./GlobalGuideLink"
import { useGlobalTopic } from "../../GlobalContext/global-topic"

type Link = {
  title: string
  url: string
  id: string
  year: string
  protocol: string
  description?: string
}

type Props = {
  title: string
  summary?: string
  links: Link[]
}

export default function GuideSection(props: Props) {
  const topic = useGlobalTopic()
  return (
    <div
      id={props.title}
      class=" flex-col leading-[18.78px] dark:border-dark border-light dark:bg-neutral-900  rounded-[6px]"
    >
      <div
        class={clsx(
          "flex-col gap-1",
          props.links.length > 0 &&
            "border-b-[0.5px] p-4 border-[#69696951]  dark:border-[#282828]"
        )}
      >
        <div class="flex-between">
          <div class="text-[#131313] dark:text-white text-opacity-60 font-bold">
            {props.title}
          </div>
          <div>{props.links.length}</div>
        </div>
        <Show when={props.summary}>
          <div class="text-[#696969] text-[14px]" innerHTML={props.summary} />
        </Show>
      </div>
      <div class="flex-col">
        <For each={props.links}>
          {(link) => {
            // TODO: improve this
            // const bookmarked = topic.globalTopic.linksBookmarkedIds.includes(
            //   link.id
            // )
            // let inProgress
            // let completed
            // if (!bookmarked) {
            //   inProgress = topic.globalTopic.linksInProgressIds.includes(
            //     link.id
            //   )
            // }
            // if (!bookmarked && !inProgress) {
            //   completed = topic.globalTopic.linksCompletedIds.includes(link.id)
            // }
            // const liked = topic.globalTopic.linksLikedIds.includes(link.id)
            return (
              <GlobalGuideLink
                title={link.title}
                url={link.url}
                id={link.id}
                year={link.year}
                protocol={link.protocol}
                description={link.description}
                // liked={liked}
                // progressState={
                //   bookmarked
                //     ? "Bookmark"
                //     : inProgress
                //       ? "InProgress"
                //       : completed
                //         ? "Completed"
                //         : null
                // }
              />
            )
          }}
        </For>
      </div>
    </div>
  )
}
