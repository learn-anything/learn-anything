import { Icon } from "."

interface Props {
  onClick: () => void
  class: string
  icon: string
  activeIcon: boolean
}

// TODO: currently incomplete
// to be used in GlobalGuideLink.tsx
export function IconButton(props: Props) {
  return (
    <div onClick={props.onClick} class={props.class}>
      <Icon
        name="Bookmark"
        fill="white"
        border={props.activeIcon ? "red" : "black"}
      />
    </div>
  )
}
