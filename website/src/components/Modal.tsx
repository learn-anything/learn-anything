interface Props {
  children: any
  onClose: () => void
}

export default function Modal(props: Props) {
  return (
    <>
      <div class="fixed top-0 left-0 w-screen z-10 h-screen backdrop-blur-sm">
        <div
          class="fixed top-0 left-0 z-20 w-screen h-screen"
          onClick={() => {
            props.onClose()
          }}
        ></div>
        <div class="w-full h-full z-30 flex items-center justify-center">
          {props.children}
        </div>
      </div>
    </>
  )
}
