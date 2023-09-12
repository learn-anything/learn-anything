import { For } from "solid-js"
import Icon from "../Icon"
import { Show } from "solid-js"
import { Link } from "../../GlobalContext/global-topic"

type Props = {
  title: string
  links: Link[]
}

export default function GuideSection(props: Props) {
  return (
    <div class="pt-6 flex flex-col gap-6 leading-[18.78px] border-[#EAEAEA] border rounded-lg p-3">
      <div class="text-[#131313] font-bold">{props.title}</div>
      <div class="flex flex-col gap-6">
        <For each={props.links}>
          {(link) => {
            return (
              <div class="flex items-center gap-6 justify-between">
                {/* <div class="">
                  <div class="bg-neutral-400 w-10 h-10 rounded-full"></div>
                </div> */}
                <div class="w-full  h-full flex justify-between items-center">
                  <div class="w-fit flex flex-col">
                    <div class="font-bold text-[#3B5CCC]">{link.title}</div>
                    <div class="flex">
                      {/* <Show when={link?.type}>
                        <div class="font-light text-[12px] text-[#696969] border-r border-[#CCCCCC] px-2">
                          {link?.type}
                        </div>
                      </Show> */}
                      <Show when={link?.year}>
                        <div class="font-light text-[12px] text-[#696969] border-r border-[#CCCCCC] px-2">
                          {link?.year}
                        </div>
                      </Show>
                      <Show when={link?.author}>
                        <div class="font-light text-[12px] text-[#696969] border-r border-[#CCCCCC] px-2">
                          {link?.author}
                        </div>
                      </Show>
                      {/* <Show when={link?.time}>
                        <div class="font-light text-[12px] text-[#696969] border-r border-[#CCCCCC] px-2">
                          {link?.time}
                        </div>
                      </Show> */}
                      <div class="font-light text-[12px] text-[#696969] px-2">
                        {link.url}
                      </div>
                    </div>
                    {/* <div class="font-light text-[12px] text-[#696969]">PDF</div> */}
                  </div>
                  <div class="flex items-center gap-[34px]">
                    <div class="gap-4 flex ">
                      <div class="rounded-[2px] border h-[28px] w-[28px] border-[#CCCCCC]">
                        <Icon name="Plus" />
                      </div>
                      <div class="rounded-[2px] border h-[28px] w-[28px] border-[#CCCCCC]">
                        <Icon name="Checkmark" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }}
        </For>
      </div>
    </div>
  )
}
