import { JSX } from 'solid-js'

interface LoaderProps {
  children: JSX.Element
}

export const Loader = (props: LoaderProps) => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        'justify-content': 'center',
        'align-items': 'center',
      }}
    >
      {props.children}
    </div>
  )
}
