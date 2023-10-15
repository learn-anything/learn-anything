import { Show } from "solid-js"
import Icon from "./Icon"
import { useMobius } from "../root"

interface Props {
  title: string
  id: string
  url: string
  year: string
  protocol: string
}

export default function GlobalLink(props: Props) {
  const mobius = useMobius()
  return (
    <div
      onClick={() => {
        console.log(`${props.protocol}://${props.url}`, "test")
      }}
      class="flex items-center overflow-hidden  border-b-[0.5px] dark:border-[#282828]  border-[#69696951] p-4 px-4 justify-between"
    >
      {/* <div class="">
      <div class="bg-neutral-400 w-10 h-10 rounded-full"></div>
    </div> */}
      <div class="w-full  h-full flex justify-between items-center">
        <div class="w-fit flex gap-1 flex-col">
          <a
            class="font-bold text-[#3B5CCC] dark:text-blue-400 cursor-pointer"
            href={`${props.protocol}://${props.url}`}
          >
            {props.title}
          </a>
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

            <a
              class="font-light text-[12px] text-[#696969] text-ellipsis w-[250px] overflow-hidden whitespace-nowrap"
              href={`${props.protocol}://${props.url}`}
            >
              {props.url}
            </a>
          </div>
          {/* <div class="font-light text-[12px] text-[#696969]">PDF</div> */}
        </div>
        <div class="flex items-center gap-[34px]">
          <div class="gap-4 flex ">
            {/* TODO: change how icon looks when link is already added. activated state  */}
            {/* UI of being pressed in */}
            <div
              onClick={async () => {
                await mobius.mutate({
                  updateGlobalLinkStatus: {
                    where: {
                      action: "like",
                      globalLinkId: props.id
                    },
                    select: true
                  }
                })
              }}
              class="cursor-pointer rounded-[2px] flex dark:hover:bg-neutral-950 items-center hover:border-none transition-all justify-center border h-[30px] w-[30px] border-[#69696951] dark:border-[#282828]"
            >
              <Icon name="Plus" />
            </div>
            <div
              onClick={async () => {
                await mobius.mutate({
                  updateGlobalLinkStatus: {
                    where: {
                      action: "complete",
                      globalLinkId: props.id
                    },
                    select: true
                  }
                })
              }}
              class="cursor-pointer rounded-[2px] dark:hover:bg-neutral-950 hover:border-none border flex items-center transition-all justify-center h-[30px] w-[30px] border-[#69696951] dark:border-[#282828]"
            >
              <Icon name="Checkmark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
