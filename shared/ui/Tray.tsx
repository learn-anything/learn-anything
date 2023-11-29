import { JSXElement } from "solid-js"
import { Modal } from "./Modal"

interface Props {
  onClose: () => void
  children: JSXElement
}
export function Tray(props: Props) {
  return (
    <>
      <style>{`

      `}</style>

      <Modal onClose={props.onClose}>
        <div class="absolute bottom-0 left-0 flex items-center justify-center p-4 w-full h-fit">
          <div id="" class="w-[350px] bg-white h-[250px] rounded-[20px] p-4">
            {props.children}
          </div>
        </div>
      </Modal>
    </>
  )
}
