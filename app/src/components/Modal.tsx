import { useUser } from "../GlobalContext/user"

interface Props {
  children: any
}

export default function Modal(props: Props) {
  const user = useUser()
  return (
    <>
      <style>{`
        #ModalBackdrop {
          animation: 0.1s BackdropOpacity forwards linear
        }

        @keyframes BackdropOpacity {
          0% {
            opacity: 0
          }
          100% {
            opacity: 0.8
          }
        }
      `}</style>
      <div class="w-full h-full absolute top-0 left-0 flex items-center justify-center">
        <div
          id="ModalBackdrop"
          onclick={() => {
            user.setMode("Default")
          }}
          class="bg-white bg-opacity-50 dark:bg-neutral-900   dark:bg-opacity-50 absolute left-0 w-full h-full top-0"
        ></div>
        {props.children}
      </div>
    </>
  )
}
