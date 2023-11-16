import * as s from "solid-js"
import { FancyButton } from "./FancyButton.jsx"

export type ModalProps = {
  onClose: () => void
}

export const Modal: s.ParentComponent<ModalProps> = (props) => {
  return (
    <>
      <div class="fixed top-0 left-0 select-none w-screen z-10 h-screen backdrop-blur-sm">
        <div
          class="fixed top-0 select-none left-0 z-20 w-screen h-screen"
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

export type ModalWithMessageAndButtonProps = {
  message: string
  buttonText: string
  buttonAction: () => void
  onClose: () => void
}

export const ModalWithMessageAndButton: s.Component<
  ModalWithMessageAndButtonProps
> = (props) => {
  return (
    <>
      <style>{`
      #MessageModal {
        width: 100%;
        border-radius: 0px;
      }
      @media (min-width: 700px) {
        #MessageModal {
          width: 50%;
          border-radius: 6px;
        }
      }
    `}</style>
      <Modal onClose={props.onClose}>
        <div
          id="MessageModal"
          class="h-fit gap-4 text-[20px] border-[0.5px] border-[#69696951] dark:bg-neutral-900 flex flex-col items-center justify-between bg-white z-50 p-4 py-6 rounded-[4px]"
        >
          <div>{props.message}</div>
          <div class=" w-full h-[50px]">
            <FancyButton
              onClick={() => {
                props.buttonAction()
              }}
            >
              {props.buttonText}
            </FancyButton>
          </div>
        </div>
      </Modal>
    </>
  )
}
