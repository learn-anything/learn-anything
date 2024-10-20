import { useState, useEffect, useCallback } from "react"

const DEFAULT_RECT: DOMRect = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  toJSON: () => "{}",
}

export function useContainerSize(element: HTMLElement | null): DOMRect {
  const [size, setSize] = useState<DOMRect>(
    () => element?.getBoundingClientRect() ?? DEFAULT_RECT,
  )

  const handleResize = useCallback(() => {
    if (!element) return

    const newRect = element.getBoundingClientRect()

    setSize((prevRect) => {
      if (
        Math.round(prevRect.width) === Math.round(newRect.width) &&
        Math.round(prevRect.height) === Math.round(newRect.height) &&
        Math.round(prevRect.x) === Math.round(newRect.x) &&
        Math.round(prevRect.y) === Math.round(newRect.y)
      ) {
        return prevRect
      }
      return newRect
    })
  }, [element])

  useEffect(() => {
    if (!element) return

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(element)

    window.addEventListener("click", handleResize)
    window.addEventListener("resize", handleResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("click", handleResize)
      window.removeEventListener("resize", handleResize)
    }
  }, [element, handleResize])

  return size
}
