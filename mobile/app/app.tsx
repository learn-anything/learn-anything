import { CoreTypes, EventData, Image } from "@nativescript/core"

const App = () => {
  let logo: Image
  let pulsating = false
  const loadedLogo = (args: EventData) => {
    logo = args.object as Image
    if (!pulsating) {
      pulsating = true
      pulseLogo()
    }
  }
  const pulseLogo = () => {
    logo
      .animate({
        scale: { x: 1.2, y: 1.2 },
        opacity: 1,
        duration: 1000,
        iterations: 1,
        curve: CoreTypes.AnimationCurve.easeInOut
      })
      .then(() => {
        logo
          .animate({
            scale: { x: 1, y: 1 },
            opacity: 0.8,
            duration: 800,
            iterations: 1,
            curve: CoreTypes.AnimationCurve.easeInOut
          })
          .then(() => {
            pulseLogo()
          })
      })
  }

  // draft commit
  return (
    <>
      <gridlayout rows="auto,*" class="bg-[#3c495e]">
        <stacklayout class="bg-[#075B88]">
          <label
            text="Organize"
            class="bg-[#43B3F4] h-[70] text-center text-white"
          />
          <label
            text="world's"
            height="70"
            class="bg-[#1089CA]  h-[70] text-center text-white"
          />
          <label
            text="knowledge"
            height="70"
            class="h-[70] text-center text-white"
          />
        </stacklayout>
        <image
          row="1"
          src="~/assets/logo-white-512.png"
          height="256"
          width="256"
          class="mt-8 rounded-2xl"
          on:loaded={(e: any) => loadedLogo(e)}
        />
      </gridlayout>
    </>
  )
}

export { App }
