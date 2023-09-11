import { createEventListener } from "@solid-primitives/event-listener"

// TODO: should be part of solid primitives ideally
export function createShortcuts(map: Record<string, VoidFunction>): void {
  for (const [key, fn] of Object.entries(map)) {
    const lowerKey = key.toLowerCase()
    createEventListener(window, "keydown", (e) => {
      if (e.key.toLowerCase() === lowerKey) {
        e.preventDefault()
        fn()
      }
    })
  }
}
