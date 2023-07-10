export default function Sidebar() {
  return (
    <>
      <div
        class="dark:bg-neutral-800 bg-zinc-200 flex h-full"
        style={{ width: "25%" }}
      >
        <div class="flex flex-col justify-between items-center font-semibold p-4 py-4 border-r-2 border-opacity-10 border-slate-100">
          <div>stuff</div>
          <div class="flex flex-col items-center gap-3">
            <div>Set</div>
            <div>Help</div>
          </div>
        </div>
        <div>
          <div
            class="flex flex-col gap-3 px-6 py-4 font-semibold"
            style={{ "font-size": "18px" }}
          >
            <div class="font-bold opacity-70">Intro</div>
            <div class="pl-8 opacity-70 flex flex-col gap-2 border-l border-opacity-30 border-slate-100">
              <div>Hi</div>
              <div>Bye</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
