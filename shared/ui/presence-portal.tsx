import * as s from "solid-js"
import * as sweb from "solid-js/web"

type PortalProps = s.ComponentProps<typeof sweb.Portal>

export type PresencePortalProps = Omit<PortalProps, "children"> & {
  children: (done: () => void) => s.JSXElement
}

export function PresencePortal(props: PresencePortalProps): s.JSXElement {
  let dispose: () => void,
    should_dispose = false

  s.onCleanup(() => (should_dispose = true))

  const children = s.createMemo(() =>
    props.children(() => should_dispose && dispose())
  )

  s.createRoot((_dispose) => {
    dispose = _dispose
    sweb.Portal(
      s.mergeProps(props, {
        get children() {
          return children()
        }
      }) as PortalProps
    )
  })

  return ""
}
