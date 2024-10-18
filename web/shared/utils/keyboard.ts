import { isServer } from "@shared/utils"

interface ShortcutKeyResult {
  symbol: string
  readable: string
}

export function getShortcutKey(key: string): ShortcutKeyResult {
  const lowercaseKey = key.toLowerCase()
  if (lowercaseKey === "mod") {
    return isMac()
      ? { symbol: "⌘", readable: "Command" }
      : { symbol: "Ctrl", readable: "Control" }
  } else if (lowercaseKey === "alt") {
    return isMac()
      ? { symbol: "⌥", readable: "Option" }
      : { symbol: "Alt", readable: "Alt" }
  } else if (lowercaseKey === "shift") {
    return isMac()
      ? { symbol: "⇧", readable: "Shift" }
      : { symbol: "Shift", readable: "Shift" }
  } else {
    return { symbol: key.toUpperCase(), readable: key }
  }
}

export function getShortcutKeys(keys: string[]): ShortcutKeyResult[] {
  return keys.map((key) => getShortcutKey(key))
}

export function isModKey(
  event: KeyboardEvent | MouseEvent | React.KeyboardEvent,
) {
  return isMac() ? event.metaKey : event.ctrlKey
}

export function isMac(): boolean {
  if (isServer()) {
    return false
  }
  return window.navigator.platform === "MacIntel"
}

export function isWindows(): boolean {
  if (isServer()) {
    return false
  }
  return window.navigator.platform === "Win32"
}

let supportsPassive = false

try {
  const opts = Object.defineProperty({}, "passive", {
    get() {
      supportsPassive = true
    },
  })
  // @ts-expect-error ts-migrate(2769) testPassive is not a real event
  window.addEventListener("testPassive", null, opts)
  // @ts-expect-error ts-migrate(2769) testPassive is not a real event
  window.removeEventListener("testPassive", null, opts)
} catch (e) {
  // No-op
}

export const supportsPassiveListener = supportsPassive
