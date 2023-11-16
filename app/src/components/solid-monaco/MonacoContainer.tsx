import { JSX } from 'solid-js'

interface MonacoContainerProps {
  width?: string
  height?: string
  class?: string
  children?: JSX.Element
}

export const MonacoContainer = (props: MonacoContainerProps) => {
  return (
    <div
      class={props.class}
      style={{
        display: 'flex',
        position: 'relative',
        'text-align': 'initial',
        width: props.width,
        height: props.height,
      }}
    >
      {props.children}
    </div>
  )
}
