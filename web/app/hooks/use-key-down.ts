import * as React from "react"
import { isTextInput } from "@/lib/utils"
import { isModKey, isServer } from "@shared/utils"

export type KeyFilter = ((event: KeyboardEvent) => boolean) | string
export type Options = { allowInInput?: boolean }

type RegisteredCallback = {
  callback: (event: KeyboardEvent) => void
  options?: Options
}

let callbacks: RegisteredCallback[] = []
let isInitialized = false

const initializeKeyboardListeners = () => {
  if (isServer() || isInitialized) return

  let imeOpen = false

  window.addEventListener("keydown", (event) => {
    if (imeOpen) return

    for (const registered of [...callbacks].reverse()) {
      if (event.defaultPrevented) break

      if (
        !isTextInput(event.target as HTMLElement) ||
        registered.options?.allowInInput ||
        isModKey(event)
      ) {
        registered.callback(event)
      }
    }
  })

  window.addEventListener("compositionstart", () => {
    imeOpen = true
  })
  window.addEventListener("compositionend", () => {
    imeOpen = false
  })

  isInitialized = true
}

const createKeyPredicate = (keyFilter: KeyFilter) =>
  typeof keyFilter === "function"
    ? keyFilter
    : typeof keyFilter === "string"
      ? (event: KeyboardEvent) => event.key === keyFilter
      : keyFilter
        ? () => true
        : () => false

export function useKeyDown(
  key: KeyFilter,
  fn: (event: KeyboardEvent) => void,
  options?: Options,
): void {
  const predicate = React.useMemo(() => createKeyPredicate(key), [key])

  React.useEffect(() => {
    initializeKeyboardListeners()

    const handler = (event: KeyboardEvent) => {
      if (predicate(event)) {
        fn(event)
      }
    }

    callbacks.push({ callback: handler, options })

    return () => {
      callbacks = callbacks.filter((cb) => cb.callback !== handler)
    }
  }, [fn, predicate, options])
}
