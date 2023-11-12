/* @refresh reload */
import { render } from "solid-js/web"

import "./root.css"
import Root from "./Root"

render(() => <Root />, document.getElementById("root") as HTMLElement)
