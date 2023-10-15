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
    <Modal onClose={props.onClose}>
      <div class="w-1/2 h-fit gap-4 text-[20px] border-[0.5px] border-[#69696951] dark:bg-neutral-900 flex flex-col items-center justify-between bg-white z-50 p-4 rounded-[4px]">
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
  )
}
