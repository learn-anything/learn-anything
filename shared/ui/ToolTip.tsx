import { createEffect, createSignal } from "solid-js"

interface Props {
  title: string
  children: any
}

export function ToolTip(props: Props) {
  const [tooltipPosition, setTooltipPosition] = createSignal("")
  const [runEffect, setRunEffect] = createSignal(true)
  createEffect(() => {
    runEffect()
    console.log("hi")
    const myElement = document.getElementById("tooltip")
    if (myElement) {
      const rect = myElement.getBoundingClientRect()

      console.log(rect)

      console.log(window.innerHeight, window.innerWidth)

      switch (true) {
        case window.innerWidth - 400 < rect.x &&
          window.innerHeight - 400 < rect.y:
          return setTooltipPosition("BR")
          break
        case 400 > rect.x && 400 > rect.y:
          return setTooltipPosition("TL")
          break
        case window.innerWidth - 400 < rect.x && 400 > rect.y:
          return setTooltipPosition("TR")
          break
        case 400 > rect.x && window.innerHeight - 400 < rect.y:
          return setTooltipPosition("BL")
          break
        default:
          return setTooltipPosition("BR")
          break
      }
    }
  })

  return (
    <>
      <div id="tooltip" class="has-tooltip relative">
        <div
          style={{
            top:
              tooltipPosition() === "BR"
                ? "-140%"
                : tooltipPosition() === "BL"
                  ? "-140%"
                  : tooltipPosition() === "TR"
                    ? "140%"
                    : "140%",
            right:
              tooltipPosition() === "BL"
                ? "-50px"
                : tooltipPosition() === "TL"
                  ? "-50px"
                  : "",
            left:
              tooltipPosition() === "BR"
                ? "-50px"
                : tooltipPosition() === "TR"
                  ? "-50px"
                  : ""
          }}
          class="tooltip bg-white dark:bg-neutral-900 rounded-[4px] px-4 p-0.5 dark:text-white text-black text-opacity-70 dark:text-opacity-70 border dark:border-[#282828]  border-[#69696951] "
        >
          {props.title}
        </div>
        <div
          onClick={() => {
            console.log(tooltipPosition(), "wtf")
            setRunEffect(!runEffect())
          }}
        >
          {props.children}
        </div>
      </div>
    </>
  )
}
