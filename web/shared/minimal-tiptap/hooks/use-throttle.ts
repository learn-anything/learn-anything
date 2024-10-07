import * as React from "react"

export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const lastRan = React.useRef(Date.now())
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  return React.useCallback(
    (...args: Parameters<T>) => {
      const handler = () => {
        if (Date.now() - lastRan.current >= delay) {
          callback(...args)
          lastRan.current = Date.now()
        } else {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          timeoutRef.current = setTimeout(
            () => {
              callback(...args)
              lastRan.current = Date.now()
            },
            delay - (Date.now() - lastRan.current),
          )
        }
      }

      handler()
    },
    [callback, delay],
  )
}
