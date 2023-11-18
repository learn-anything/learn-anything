import * as s from "solid-js"
import { PresencePortal } from "./presence-portal"

const clamp = (min: number, value: number, max: number) =>
  Math.min(Math.max(min, value), max)

const FADE_FROM: Keyframe = { opacity: 0, transform: "translateY(0.3rem)" }
const FADE_TO: Keyframe = { opacity: 1, transform: "translateY(0)" }
const FADE_OPTIONS: KeyframeAnimationOptions = {
  duration: 100,
  easing: "ease",
  fill: "forwards"
}

function fade(way: "in" | "out", el: Element): Animation {
  return el.animate(
    way === "in" ? [FADE_FROM, FADE_TO] : [FADE_TO, FADE_FROM],
    FADE_OPTIONS
  )
}

export type TooltipTarget =
  | HTMLElement
  | s.Accessor<HTMLElement | null | undefined | false>
export type TooltipLabel = string | s.Accessor<s.JSXElement>

export function createTooltip(
  target: TooltipTarget,
  label: TooltipLabel
): void {
  const getTarget = () =>
    target instanceof HTMLElement ? target : target() || null

  const [active, setActive] = s.createSignal(false)
  const activate = () => setActive(true)
  const deactivate = () => setActive(false)

  s.createEffect(() => {
    const el = getTarget()
    if (!el) return

    el.addEventListener("mouseenter", activate)
    el.addEventListener("mouseleave", deactivate)
    el.addEventListener("focus", activate)
    el.addEventListener("blur", deactivate)

    s.onCleanup(() => {
      el.removeEventListener("mouseenter", activate)
      el.removeEventListener("mouseleave", deactivate)
      el.removeEventListener("focus", activate)
      el.removeEventListener("blur", deactivate)
    })
  })

  s.onCleanup(deactivate)

  void (
    <s.Show when={active()}>
      <PresencePortal>
        {(hide) => (
          <div
            ref={(tooltip) => {
              requestAnimationFrame(() => fade("in", tooltip))
              s.onCleanup(() => fade("out", tooltip).finished.then(hide))

              const updateTooltipPosition = () => {
                const el = getTarget()
                if (!el) return

                const target_rect = el.getBoundingClientRect()
                const target_x = target_rect.x
                const target_y = target_rect.y
                const target_w = target_rect.width
                const target_h = target_rect.height
                const tooltip_rect = tooltip.getBoundingClientRect()
                const tooltip_w = tooltip_rect.width
                const tooltip_h = tooltip_rect.height

                const target_margin = 8
                const window_margin = 12

                const x = clamp(
                  window_margin,
                  target_x + target_w / 2 - tooltip_w / 2,
                  window.innerWidth - window_margin - tooltip_w
                )

                let y = target_y - tooltip_h - target_margin
                if (y < window_margin) {
                  y = target_y + target_h + target_margin
                }

                tooltip.style.top = `${y}px`
                tooltip.style.left = `${x}px`
              }

              s.createEffect(updateTooltipPosition)

              window.addEventListener("resize", updateTooltipPosition)
              window.addEventListener("scroll", updateTooltipPosition)

              s.onCleanup(() => {
                window.removeEventListener("resize", updateTooltipPosition)
                window.removeEventListener("scroll", updateTooltipPosition)
              })
            }}
            class="fixed z-0 top-0 left-0 pointer-events-none bg-white dark:bg-neutral-900 rounded-md px-4 p-0.5 dark:text-white text-black text-opacity-70 dark:text-opacity-70 border dark:border-[#282828] border-[#69696951]"
          >
            {label as s.JSXElement}
          </div>
        )}
      </PresencePortal>
    </s.Show>
  )
}

export function Tooltip(props: {
  title: s.JSXElement
  children: s.JSXElement
}): s.JSXElement {
  const children = s.children(() => props.children)

  const target = s.createMemo(() => {
    const child = children.toArray().at(-1)
    return child instanceof HTMLElement ? child : null
  })

  createTooltip(target, () => props.title)

  return <>{children()}</>
}

export const ToolTip = Tooltip
