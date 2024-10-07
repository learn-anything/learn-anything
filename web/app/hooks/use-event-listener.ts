import * as React from "react"

type EventMap = WindowEventMap & HTMLElementEventMap & VisualViewportEventMap

export function useEventListener<
  K extends keyof EventMap,
  T extends Window | HTMLElement | VisualViewport | null = Window,
>(
  eventName: K,
  handler: (event: EventMap[K]) => void,
  element: T = window as unknown as T, // Cast to `unknown` first, then `T`
  options: AddEventListenerOptions = {},
) {
  const savedHandler = React.useRef<(event: EventMap[K]) => void>()
  const { capture, passive, once } = options

  React.useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  React.useEffect(() => {
    const isSupported = element && element.addEventListener
    if (!isSupported) return

    const eventListener = (event: EventMap[K]) => savedHandler.current?.(event)

    const opts = { capture, passive, once }
    element.addEventListener(eventName, eventListener as EventListener, opts)
    return () => {
      element.removeEventListener(
        eventName,
        eventListener as EventListener,
        opts,
      )
    }
  }, [eventName, element, capture, passive, once])
}
