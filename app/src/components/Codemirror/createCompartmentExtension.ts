import { Compartment, Extension, StateEffect } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { Accessor, createEffect, on } from "solid-js"

export type CompartmentReconfigurationCallback = (extension: Extension) => void

/**
 * Creates a compartment extension for the given CodeMirror EditorView.
 *
 * Extension compartments can be used to make a configuration dynamic.
 * By wrapping part of your configuration in a compartment, you can later replace that part through a transaction.
 *
 * See {@link https://codemirror.net/examples/reconfigure/} for use cases and examples of `Compartments`.
 * Check out {@link https://codemirror.net/docs/ref/#state.Compartment} for more details about Compartment API.
 *
 * @param extension The extension to wrap in a compartment.
 * @param view The CodeMirror EditorView
 */
export function createCompartmentExtension(
  extension: Accessor<Extension | undefined> | Extension,
  view: Accessor<EditorView | undefined>,
): CompartmentReconfigurationCallback {
  const compartment = new Compartment()

  const reconfigure = (extension: Extension) => {
    view()?.dispatch({
      effects: compartment.reconfigure(extension),
    })
  }

  const $extension =
    typeof extension === "function" ? extension : () => extension

  createEffect(
    on(
      [view, $extension],
      ([view, extension]) => {
        if (view && extension) {
          if (compartment.get(view.state)) {
            reconfigure(extension)
          } else {
            view.dispatch({
              effects: StateEffect.appendConfig.of(compartment.of(extension)),
            })
          }
        }
      },
      { defer: true },
    ),
  )

  return reconfigure
}
