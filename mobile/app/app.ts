import { Application } from "@nativescript/core"
import { render } from "@nativescript-community/solid-js"
import { document } from "dominative";
import { App } from "./app.tsx"

document.body.actionBarHidden = true
// todo: check with Ammar on types
document.body.appendChild(document.createElement("ContentView") as any)

render(App, document.body.firstElementChild);

const create = () => document;

Application.run({ create });
