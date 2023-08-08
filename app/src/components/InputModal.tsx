// TODO: fix auto focus on input
// it works only on first time modal gets loaded
import Modal from "./Modal"

export default function InputModal() {
  return (
    <>
      <style>
        {`
          #NewInput {
            animation: 0.1s ScaleInput forwards linear
          }
          @keyframes ScaleInput {
            0% {
              transform: scale(0.9);
              oapcity: 0
            }
            100% {(
              transform: scale(1);
              opacity: 1;
            }
          }

        `}
      </style>
      <Modal>
        <div
          id="NewInput"
          style={{
            width: "78%",
            height: "fit-content",
            background: ` radial-gradient(
              farthest-corner circle at 18% 23% in hsl,
              hsl(311 0% 31% / 0%) 0%, hsl(141 0% 14% / 10%) 100%
            )`,
            // "backdrop-filter": "blur(3px)",
          }}
          class="flex items-center bg-clip-border justify-center relative bg-transparent border-slate-400 border border-opacity-30 rounded-2xl"
        >
          <div
            style={{ width: "99.78%", height: "99.6%" }}
            class="flex flex-col gap-[1px] justify-center bg-opacity-90 rounded-3xl"
          >
            <div
              style={{ "border-radius": "24px 24px 0 0" }}
              class="w-full h-fit flex gap-5 flex-col items-center justify-center   p-5"
            >
              <div
                style={{
                  background: `  radial-gradient(
                    farthest-corner circle at 81% 15% in hsl,
                    hsl(311 0% 31%) 0%, hsl(141 0% 23%) 100%
                  )`,
                }}
                class=" w-full rounded-lg p-[1px]"
              >
                <div class="p-5 py-8 flex flex-col gap-4 bg-opacity-80 dark:bg-neutral-900 bg-white rounded-lg w-full">
                  <input
                    type="text"
                    placeholder="Title"
                    class="px-5 bg-transparent  outline-none font-bold text-3xl w-full"
                  />
                  <input
                    type="text"
                    placeholder="Content"
                    class="bg-transparent outline-none px-5 pb-10 w-full"
                  />
                </div>
              </div>
              <div
                style={{
                  background: `  radial-gradient(
                    farthest-corner circle at 81% 15% in hsl,
                    hsl(311 0% 31%) 0%, hsl(141 0% 23%) 100%
                  )`,
                }}
                class="w-fit self-end rounded p-[1px]"
              >
                <div class="rounded px-4 p-1 hover:bg-opacity-100 transition-all font-semibold bg-opacity-90 dark:bg-neutral-900 bg-white">
                  Capture
                </div>
              </div>
            </div>
            <div
              style={{ "border-radius": "0 0 24px 24px" }}
              class="h-full w-full "
            ></div>
          </div>
        </div>
      </Modal>
    </>
  )
}
