import * as s from "solid-js"
import { FancyButton } from "./FancyButton.jsx"

export type ModalProps = {
  onClose: () => void
}

export const Modal: s.ParentComponent<ModalProps> = (props) => {
  return (
    <>
      <style>
        {`
          #Modal > div {
            animation: 0.1s ModalShow forwards ease-in;
            z-index: 40;
          }
          #ModalOverlay {
            animation: 1s ModalOverlayShow forwards ease-out;
          }
          @keyframes ModalShow {
            0% {
              transform: scale(0.5) translate(50px, 50px);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: scale(1) translate(0,0);
            }
          }
          @keyframes ModalOverlayShow {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
      `}
      </style>
      <div
        id="ModalContainer"
        class="fixed top-0 z-10 left-0 select-none w-screen h-screen backdrop-blur-sm"
      >
        <div
          id="ModalOverlay"
          class="fixed top-0 select-none z-20 left-0 w-screen h-screen"
          onClick={() => {
            props.onClose()
          }}
        ></div>
        <div
          id="Modal"
          class="w-full relative h-full flex items-center justify-center"
        >
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
          <div class="w-full h-[50px] overflow-hidden">
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
