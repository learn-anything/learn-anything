import { For, onMount } from "solid-js"
import GlobalLink from "../GlobalLink"
import clsx from "clsx"

type Link = {
  title: string
  url: string
  id: string
  year: string
  protocol: string
}

type Props = {
  title: string
  links: Link[]
}

export default function GuideSection(props: Props) {
  return (
    <div class=" flex flex-col leading-[18.78px] dark:border-[#282828] border-[#69696951] dark:bg-neutral-900 border-[0.5px] rounded-[6px]">
      <div
        class={clsx(
          "",
          props.links.length > 0 &&
            "border-b-[0.5px] p-4 border-[#69696951]  dark:border-[#282828]"
        )}
      >
        <div class="text-[#131313] dark:text-white text-opacity-60 font-bold">
          {props.title}
        </div>
        <div>{}</div>
      </div>
      <div class="flex flex-col">
        <For each={props.links}>
          {(link) => {
            return (
              <GlobalLink
                title={link.title}
                url={link.url}
                id={link.id}
                year={link.year}
                protocol={link.protocol}
              />
            )
          }}
        </For>
      </div>
    </div>
  )
}
