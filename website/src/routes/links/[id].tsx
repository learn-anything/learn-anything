import { Show, createSignal, onMount } from "solid-js"
import { useParams } from "solid-start"
import { useMobius } from "../../root"
import { Button } from "@kobalte/core"
import { Checkbox } from "@kobalte/core"
import Icon from "../../components/Icon"

export default function GlobalLinkEdit() {
  const params = useParams()
  const mobius = useMobius()
  const [linkData, setLinkData] = createSignal()

  onMount(async () => {
    const link = await mobius.query({
      getGlobalLink: {
        where: {
          linkId: params.id!,
        },
        select: {
          title: true,
          url: true,
          fullUrl: true,
          mainTopicAsString: true,
          protocol: true,
          verified: true,
          public: true,
          description: true,
          urlTitle: true,
          year: true,
        },
      },
    })
    console.log(link, "link")
    // TODO: super annoying having to do this, figure out how to get stuff type safe
    // from queries..
    // @ts-ignore
    setLinkData(link.data.getGlobalLink)
    console.log(linkData(), "link data")
    console.log(linkData().title, "title")
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
      `}
      </style>
      <div class="p-[24px] flex justify-center bg-zinc-100 w-screen h-screen text-black">
        <Show when={linkData()}>
          <div class="rounded-lg w-1/2 relative bg-white font-light h-1/2 flex flex-col p-6 px-6 gap-4">
            <div class="flex flex-col gap-4 [&>*]:px-2 [&>*]:transition-all [&>*]:p-1">
              <div class="relative w-full border-b border-slate-200 hover:border-slate-400">
                <input
                  value={linkData().title}
                  class="text-[20px] w-full outline-none"
                ></input>
                <div class="absolute right-4 font-light text-opacity-40 text-black top-0 h-full flex items-center">
                  Title
                </div>
              </div>
              <input
                value={linkData().url}
                class="text-[16px] w-full border-slate-200 focus:border-slate-400 outline-none border-b"
              >
                Url
              </input>
            </div>
            <div class="w-full flex gap-6">
              <Checkbox.Root class="checkbox">
                <Checkbox.Input class="checkbox__input" />
                <Checkbox.Control class="checkbox__control">
                  <Checkbox.Indicator>
                    <Icon name="Checkmark"></Icon>
                  </Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.Label class="checkbox__label">
                  Verified
                </Checkbox.Label>
              </Checkbox.Root>
              <Checkbox.Root class="checkbox">
                <Checkbox.Input class="checkbox__input" />
                <Checkbox.Control class="checkbox__control">
                  <Checkbox.Indicator>
                    <Icon name="Checkmark"></Icon>
                  </Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.Label class="checkbox__label">Public</Checkbox.Label>
              </Checkbox.Root>
            </div>
            <Button.Root class=" bg-blue-600 absolute bottom-4 right-4 rounded-[4px] text-[24px] px-8 p-2 text-white">
              Save
            </Button.Root>
          </div>
        </Show>
      </div>
    </>
  )
}
