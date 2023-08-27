import { Show, createSignal } from "solid-js"

export default function TopicNav() {
  const [showInput, setShowInput] = createSignal(false)
  return (
    <>
      <style>
        {`
      #InputMinimised {
        width: 212px;
      }
      #InputExpanded {
        width: 500px;
      }
      `}
      </style>
      <div class="flex flex-col">
        <div
          class="h-[80px] w-full p-4 flex items-center justify-between"
          style={{
            filter:
              "drop-shadow(0, 0, 3, rgba(105, 105, 105, 0.32)) !important",
          }}
        >
          <div class="flex gap-4 h-full items-center">
            <div class=" w-[40px] h-[40px] bg-neutral-200 rounded-full"></div>
            <div
              onClick={() => {
                setShowInput(true)
              }}
              id={showInput() ? "InputExpanded" : "InputMinimised"}
              class="bg-neutral-200 rounded-[4px] transition-all h-full p-[12px] text-[#696969] font-light"
            >
              <Show
                when={showInput()}
                fallback={<div class="">Search Topic</div>}
              >
                <div class="flex items-center">
                  <input
                    type="text"
                    class="w-full bg-transparent outline-none"
                    placeholder="Search Topic"
                  />
                </div>
              </Show>
            </div>
          </div>
          <div class="flex items-center justify-center gap-4">
            <div>Themes</div>
            <div class="bg-[#3B5CCC] leading-[23.48px] w-[91px] text-white h-[39px] flex items-center justify-center font-light text-[20px] px-4 p-2 rounded-full">
              Log In
            </div>
            <div>Menu</div>
          </div>
        </div>
        <div class="h-[30px] w-full bg-[#EAEAEA]">breadcrumb</div>
      </div>
    </>
  )
}
