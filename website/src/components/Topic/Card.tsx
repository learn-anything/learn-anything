import { div } from "edgedb/dist/primitives/bigint"
import { For, Show } from "solid-js"

type Link = {
  title: string
  url: string
  year?: string
  type?: string
  author?: string
  time?: string
  relatedLinks?: Link[]
}

type Props = {
  name: string
  links?: Link[]
}

export default function Card(props: Props) {
  return (
    <div
      class="w-full flex flex-col gap-2 border border-[#EAEAEA] rounded-[4px] p-4 overflow-auto"
      style={{
        "min-height": "200px",
        "max-height": "250px",
      }}
    >
      <div class="font-semibold">{props.name}</div>
      <For each={props.links}>
        {(link) => {
          return (
            <div class="cursor-pointer">
              <div class="font-bold text-[#3B5CCC] text-sm">{link.title}</div>
              <div class="flex">
                <div class="font-light text-[12px] text-[#696969] px-2">
                  {link.url}
                </div>
              </div>
            </div>
          )
        }}
      </For>
    </div>
  )
}
