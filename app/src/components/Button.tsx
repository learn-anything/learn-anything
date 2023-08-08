import type { JSX } from "solid-js"

type Props = {
  children: JSX.Element
  onClick: () => void
  // icon?:  // TODO:
}

export default function Button(props: Props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
