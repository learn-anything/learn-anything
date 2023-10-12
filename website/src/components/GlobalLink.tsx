import { Show } from "solid-js"
import Icon from "./Icon"

interface Props {
  title: string
  id: string
  url: string
  year: string
}

export default function GlobalLink(props: Props) {
  return (
    <div class="flex items-center  border-b-[0.5px] dark:border-[#282828] dark:bg-[#1C1C1C] border-[#69696951] p-4 px-4 justify-between">
      {/* <div class="">
      <div class="bg-neutral-400 w-10 h-10 rounded-full"></div>
    </div> */}
      <div class="w-full  h-full flex justify-between items-center">
        <div class="w-fit flex gap-1 flex-col">
          <div class="font-bold text-[#3B5CCC] ">{props.title}</div>
          <div class="flex gap-3">
            {/* <Show when={link?.type}>
            <div class="font-light text-[12px] text-[#696969] border-r border-[#CCCCCC] px-2">
              {link?.type}
            </div>
          </Show> */}
            <Show when={props.year}>
              <div class="font-light text-[12px] text-[#696969]">
                {props.year}
              </div>
            </Show>

            <div class="font-light text-[12px] text-[#696969]">{props.url}</div>
          </div>
          {/* <div class="font-light text-[12px] text-[#696969]">PDF</div> */}
        </div>
        <div class="flex items-center gap-[34px]">
          <div class="gap-4 flex ">
            <div class="rounded-[2px] flex items-center justify-center border h-[28px] w-[28px] border-[#CCCCCC]">
              <Icon name="Plus" />
            </div>
            <div class="rounded-[2px] border flex items-center justify-center h-[28px] w-[28px] border-[#CCCCCC]">
              <Icon name="Checkmark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
