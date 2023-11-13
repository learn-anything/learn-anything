import { MonacoEditor } from "solid-monaco"

export default function Monaco() {
  return (
    <div class="dark:bg-neutral-900 flex flex-col gap-4 py-10 pr-10 pl-2 h-full overflow-scroll w-full">
      <MonacoEditor language="markdown" value="" />
    </div>
  )
}
