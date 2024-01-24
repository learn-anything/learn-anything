import { PageTransition, SharedTransition } from "@nativescript/core"
import { useRouter } from "../router"
import { For, createSignal } from "solid-js"

import { useGlobal } from "~/Global/global"

export const Home = () => {
  const store = useGlobal()
  const router = useRouter()
  const goToPage = (name: "Home" | "Settings") => {
    // just showing ios shared transition with platform spring built in
    router.navigate(
      name,
      global.isIOS
        ? {
            transition: SharedTransition.custom(new PageTransition())
          }
        : undefined
    )
  }
  return (
    <>
      <actionbar title="" class="bg-black"></actionbar>
      <stacklayout class="px-[20px]">
        <label
          text="Notes"
          class="text-[36px] font-bold text-purple-400 mb-[60px]"
        ></label>
        <flexboxlayout flexDirection="column" class="bg-neutral-900 rounded-xl">
          <For each={store.global.items}>
            {(item) => {
              return (
                <label
                  text={item}
                  on:tap={() => {
                    router.navigate("Notes", {
                      params: {
                        noteId: item
                      }
                    })
                  }}
                  class="p-[60px]"
                ></label>
              )
            }}
          </For>
        </flexboxlayout>
      </stacklayout>
    </>
  )
}
