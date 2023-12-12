import ShoSho from "shosho"
import { onMount } from "solid-js"
import { useGlobalState } from "~/GlobalContext/global"

export function keybinds() {
  const global = useGlobalState()

  const shortcuts = new ShoSho({
    capture: true,
    target: document,
  })

  // search files in wiki
  // TODO: should focus on input
  shortcuts.register("Esc", () => {
    global.set("mode", "Default")
  })
  shortcuts.register("Cmd+L", () => {
    if (global.state.mode === "SearchFilesModal") {
      global.set("mode", "Default")
    } else {
      global.set("mode", "SearchFilesModal")
    }
  })
  shortcuts.start()
}
