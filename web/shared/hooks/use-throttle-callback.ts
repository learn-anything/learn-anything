import { useCallback, useRef, useEffect } from "react"

type AnyFunction = (...args: any[]) => any

export function useThrottleCallback<T extends AnyFunction>(
  callback: T,
  deps: React.DependencyList,
  delay: number,
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastCalledRef = useRef<number>(0)
  const callbackRef = useRef<T>(callback)

  // Update the callback ref whenever the callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    // Cleanup function to clear the timeout
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()

      if (now - lastCalledRef.current >= delay) {
        // If enough time has passed, call the function immediately
        lastCalledRef.current = now
        callbackRef.current(...args)
      } else {
        // Otherwise, set a timeout to call the function later
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(
          () => {
            lastCalledRef.current = Date.now()
            callbackRef.current(...args)
          },
          delay - (now - lastCalledRef.current),
        )
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [delay, ...deps],
  ) as T
}
