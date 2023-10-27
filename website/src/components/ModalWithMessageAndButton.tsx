import Modal from "./Modal"
import FancyButton from "./FancyButton"

interface Props {
  message: string
  buttonText: string
  buttonAction: () => void
  onClose: () => void
}
export default function ModalWithMessageAndButton(props: Props) {
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
