/* @refresh reload */
import { render } from "solid-js/web"
import { StyleRegistry } from "solid-styled"
import Root from "./root.jsx"

import "./root.css"

render(
  () => (
    <StyleRegistry>
      <Root />
    </StyleRegistry>
  ),

  document.getElementById("root") as HTMLElement,
)
