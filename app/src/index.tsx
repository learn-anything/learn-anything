/* @refresh reload */
import { render } from "solid-js/web"

import "./root.css"
import Root from "./root.jsx"

render(() => <Root />, document.getElementById("root") as HTMLElement)
