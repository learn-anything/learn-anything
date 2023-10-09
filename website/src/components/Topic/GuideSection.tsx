import { For } from "solid-js"
import Icon from "../Icon"
import { Show } from "solid-js"
import { Link } from "../../GlobalContext/global-topic"
import GlobalLink from "../GlobalLink"

type Props = {
  title: string
  links: Link[]
}

export default function GuideSection(props: Props) {
  return (
    <div class=" flex flex-col leading-[18.78px] border-[#EAEAEA] border rounded-[6px]">
      <div class="p-4 border-b border-[#EAEAEA]">
        <div class="text-[#131313] text-opacity-60 font-bold">
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
              ></GlobalLink>
            )
          }}
        </For>
      </div>
    </div>
  )
}
