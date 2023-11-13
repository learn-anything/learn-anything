import clsx from "clsx"
import Icon from "./Icon"
import { Show } from "solid-js"

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
          <Icon name="Check"></Icon>
        </Show>
      </div>
    </>
  )
}
