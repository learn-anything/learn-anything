import { createUserState } from "../GlobalContext/user"

export default function Sidebar(props: any) {
  const user = createUserState()
  return (
    <>
      <div
        class=" flex h-full"
        id="Sidebar"
        style={{ width: "25%", "min-width": "250px" }}
      >
        <div class="flex dark:bg-neutral-800 bg-zinc-200 flex-col justify-between items-center font-semibold p-4 py-4 border-r-2 border-opacity-10 border-slate-100">
          <div class="hover:bg-neutral-700 p-1 px-2 rounded-md">Wiki</div>
          <div class="flex flex-col items-center gap-3">
            <div
              onClick={() => {
                // setShowEditorSettings(true)
                props.setShowSet(true)
                user.setShowEditorSettings(true)
                console.log(user.user.showEditorSettings)
              }}
            >
              Settings
            </div>
            <div
              onClick={() => {
                props.setShowToolBar(true)
              }}
            >
              Help
            </div>
          </div>
        </div>
        <div
          id="ContentSidebar"
          class="dark:bg-neutral-800 bg-zinc-200 w-full overflow-hidden"
        >
          <div
            class="flex flex-col w-full gap-3 px-6 py-4 font-semibold"
            style={{ "font-size": "18px" }}
          >
            <div class="font-bold opacity-70 hover:bg-neutral-700 rounded-md p-1 px-3 w-full">
              Intro
            </div>
            <div class="pl-6 opacity-70 flex flex-col gap-2 border-l border-opacity-30 border-slate-100">
              <div class="hover:bg-neutral-700 rounded-md p-1 px-3">Hi</div>
              <div class="hover:bg-neutral-700 rounded-md p-1 px-3">Bye</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
