import { Application } from "@nativescript/core"
import { render } from "@nativescript-community/solid-js"
import { document, registerElement } from "dominative"
import { App } from "./app.tsx"
import { registerSwiftUI, UIDataDriver } from "@nativescript/swift-ui"
import { SwiftUI } from "@nativescript/swift-ui"
declare const TestViewProvider: any

registerSwiftUI(
  "testView",
  (view) => new UIDataDriver(TestViewProvider.alloc().init(), view)
)
registerElement("swiftui", SwiftUI)

document.body.actionBarHidden = true
// todo: check with Ammar on types
document.body.appendChild(document.createElement("ContentView") as any)

render(App, document.body.firstElementChild)

const create = () => document

Application.run({ create })
