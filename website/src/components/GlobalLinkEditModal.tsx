import { Button, Checkbox } from "@kobalte/core"
import { Show, createSignal, onMount } from "solid-js"
import { GlobalLink, useGlobalTopic } from "../GlobalContext/global-topic"
import { ui } from "@la/shared"

interface Props {
  linkId: string
  onClose: () => void
}

export default function GlobalLinkEditModal(props: Props) {
  const topic = useGlobalTopic()
  const [linkToEdit, setLinkToEdit] = createSignal<GlobalLink>()

  onMount(() => {
    // find the link by id
    const link = topic.globalTopic.links.find((l) => l.id === props.linkId)
    setLinkToEdit(link)
    console.log(linkToEdit(), "link to edit")
  })

  return (
    <>
      <style>
        {`
 .checkbox {
  display: inline-flex;
  align-items: center;
}
.checkbox__control {
  height: 21px;
  width: 21px;
  border-radius: 6px;
  border: 1px solid hsl(240 5% 84%);
}
.checkbox__input:focus-visible + .checkbox__control {
  outline: 2px solid hsl(200 98% 39%);
  outline-offset: 2px;
}
.checkbox__control[data-checked] {
  border-color: hsl(200 98% 39%);
  background-color: hsl(200 98% 39%);
  color: white;
}
.checkbox__label {
  margin-left: 6px;
  color: hsl(240 6% 10%);
  font-size: 14px;
  user-select: none;
}
#LinkFocused {
  font-size: 12px;
  left: 8px;
  top: -25px;
}
#LinkUnFocused {

  left: 0;
  top: 0;
}
#LinkEditModal {
  width: 100%;
  border-radius: 0px;
}
@media (min-width: 700px) {
  #LinkEditModal {
    width: 50%;
    border-radius: 4px;
  }
}
      `}
      </style>
      <Show when={linkToEdit()}>
        <ui.Modal
          onClose={() => {
            /**/
          }}
        >
          <div
            id="LinkEditModal"
            class="rounded-lg relative bg-white dark:border-[#282828]  border-[#69696951] border dark:bg-neutral-900 z-50 font-light h-1/2 flex flex-col p-6 px-6 gap-4"
          >
            <div class="flex flex-col gap-5 [&>*]:px-2 [&>*]:transition-all [&>*]:p-1">
              <div class="relative w-full ">
                <input
                  value={linkToEdit().title}
                  class="text-[20px] font-semibold w-full bg-inherit outline-none focus:bg-neutral-800 focus:bg-opacity-70 hover:bg-neutral-800 hover:bg-opacity-50 transition-all px-2 p-1 rounded-[4px]"
                ></input>
                <div
                  id={linkToEdit().title ? "LinkFocused" : "LinkUnFocused"}
                  class="absolute px-2 font-light transition-all text-opacity-40 text-black dark:text-white h-full flex items-center"
                >
                  Title
                </div>
              </div>
              <div class="relative w-full ">
                <div
                  id={linkToEdit().url ? "LinkFocused" : "LinkUnFocused"}
                  class="absolute px-2 font-light transition-all text-opacity-40 text-black dark:text-white h-full flex items-center"
                >
                  Url
                </div>
                <input
                  value={linkToEdit().url}
                  class="text-[16px] w-full outline-none bg-inherit border-b border-slate-200 hover:border-slate-400 focus:border-slate-600 transition-all"
                >
                  Url
                </input>
              </div>
            </div>
            <div class="flex justify-between w-full">
              <div class="w-full flex gap-6">
                <Checkbox.Root class="checkbox">
                  <Checkbox.Input class="checkbox__input" />
                  <Checkbox.Control class="checkbox__control active:scale-[1.1]">
                    <Checkbox.Indicator>
                      <ui.Icon name="Checkmark"></ui.Icon>
                    </Checkbox.Indicator>
                  </Checkbox.Control>
                  <Checkbox.Label class="checkbox__label">
                    <div class="dark:text-white text-black">Verified</div>
                  </Checkbox.Label>
                </Checkbox.Root>
                <Checkbox.Root class="checkbox">
                  <Checkbox.Input class="checkbox__input" />
                  <Checkbox.Control class="checkbox__control active:scale-[1.1]">
                    <Checkbox.Indicator>
                      <ui.Icon name="Checkmark"></ui.Icon>
                    </Checkbox.Indicator>
                  </Checkbox.Control>
                  <Checkbox.Label class="checkbox__label">
                    <div class="dark:text-white text-black">Public</div>
                  </Checkbox.Label>
                </Checkbox.Root>
              </div>
              <input
                type="text"
                placeholder="hear"
                value={linkToEdit().year}
                class="bg-inherit  w-[40px]"
              />
            </div>
            <input
              class="p-1 px-2 border-[0.5px] rounded-[4px] border-slate-400 border-opacity-40 bg-inherit"
              value={"testing"}
            >
              Description
            </input>
            <Button.Root
              class=" bg-blue-500 text-[14px] absolute bottom-4 left-4 active:scale-[1.1] hover:bg-blue-600 rounded-[4px] px-6 p-2 text-white"
              onClick={() => {
                props.onClose()
              }}
            >
              Cancel
            </Button.Root>
            <Button.Root
              class=" bg-blue-500 text-[14px] absolute bottom-4 right-4 active:scale-[1.1] hover:bg-blue-600 rounded-[4px] px-6 p-2 text-white"
              onClick={() => {}}
            >
              Save
            </Button.Root>
          </div>
        </ui.Modal>
      </Show>
    </>
  )
}
