import { Show } from "solid-js"
import { ui } from "@la/shared"
import clsx from "clsx"

interface Props {
  state: boolean
  setter: (boolean: boolean) => void
}

export default function Checkbox(props: Props) {
  return (
    <>
      <div
        class={clsx(
          "bg-transparent transition-all w-[20px] flex items-center justify-center h-[20px] rounded-[2px] border-black border-[0.5px] dark:border-gray-200",
          props.state && "bg-blue-500",
        )}
        onClick={() => {
          props.setter(!props.state)
        }}
      >
        <Show when={props.state}>
          <ui.Icon name="Check" />
        </Show>
      </div>
    </>
  )
}
