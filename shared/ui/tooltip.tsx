import * as s from "solid-js"
import { PresencePortal } from "./presence-portal"

const clamp = (min: number, value: number, max: number) =>
  Math.min(Math.max(min, value), max)

const FADE_0: Keyframe = {
  opacity: 0,
  transform: "translateY(0.3rem) scale(0.7)"
}
const FADE_70: Keyframe = { transform: "translateY(0) scale(1.2)" }
const FADE_100: Keyframe = { opacity: 1, transform: "translateY(0) scale(1)" }
const FADE_OPTIONS: KeyframeAnimationOptions = {
  duration: 100,
  easing: "ease-out",
  fill: "forwards"
}

function fade(way: "in" | "out", el: Element): Animation {
  return el.animate(
    way === "in" ? [FADE_0, FADE_70, FADE_100] : [FADE_100, FADE_0],
    FADE_OPTIONS
  )
}

function updateTooltipPosition(target: Element, tooltip: HTMLElement) {
  const target_rect = target.getBoundingClientRect()
  const target_x = target_rect.x
  const target_y = target_rect.y
  const target_w = target_rect.width
  const target_h = target_rect.height
  const tooltip_rect = tooltip.getBoundingClientRect()
  const tooltip_w = tooltip_rect.width
  const tooltip_h = tooltip_rect.height

  const target_margin = 8
  const window_margin = 12

  /* ensure tooltip is within window bounds */
  const x = clamp(
    window_margin,
    target_x + target_w / 2 - tooltip_w / 2,
    window.innerWidth - window_margin - tooltip_w
  )

  /* position tooltip above or below target */
  let y = target_y - tooltip_h - target_margin
  if (y < window_margin) {
    y = target_y + target_h + target_margin
  }

  tooltip.style.top = `${y}px`
  tooltip.style.left = `${x}px`
}

export type TooltipTarget =
  | Element
  | s.Accessor<Element | null | undefined | false>
export type TooltipLabel = string | s.Accessor<s.JSXElement>

/**
 * Creates a tooltip for the given target element.
 * The tooltip will be shown when the target is hovered or focused.
 *
 * @param target target element, can be reactive
 * @param label tooltip label, can be reactive
 *
 * @example
 * ```tsx
 * <div ref={el => createTooltip(el, "Hello world!")}>
 *  Hover me!
 * </div>
 * ```
 */
export function createTooltip(
  target: TooltipTarget,
  label: TooltipLabel
): void {
  const getTarget = () =>
    target instanceof Element ? target : target() || null

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

  /*
  uses portal to render tooltip outside of the current component
  so it does't have to return jsx
  */
  void (
    <>
      <style>
        {`
          #tooltip {
            animation: 1s tooltipBounce forwards linear;
          }
          @keyframes tooltipBounce {
            0% {
              transform: scale(0.5);
            }
            70% {
              transform: scale(1.2)
            }
            100% {
              transform: scale(1);
              background: red;
            }
          }
        `}
      </style>
      <s.Show when={active()}>
        <PresencePortal>
          {(hide) => (
            <div
              ref={(tooltip) => {
                requestAnimationFrame(() => fade("in", tooltip))
                s.onCleanup(() => fade("out", tooltip).finished.then(hide))

                function boundUpdateTooltipPosition() {
                  const el = getTarget()
                  if (el) updateTooltipPosition(el, tooltip)
                }

                s.createEffect(boundUpdateTooltipPosition) // track target el change

                window.addEventListener("resize", boundUpdateTooltipPosition)
                window.addEventListener("scroll", boundUpdateTooltipPosition)

                s.onCleanup(() => {
                  window.removeEventListener(
                    "resize",
                    boundUpdateTooltipPosition
                  )
                  window.removeEventListener(
                    "scroll",
                    boundUpdateTooltipPosition
                  )
                })
              }}
              id="tooltip"
              class="fixed z-50 top-0 left-0 pointer-events-none bg-white dark:bg-neutral-900 rounded-md px-4 p-0.5 dark:text-white text-black text-opacity-70 dark:text-opacity-70 border dark:border-[#282828] border-[#69696951]"
            >
              {label as s.JSXElement}
            </div>
          )}
        </PresencePortal>
      </s.Show>
    </>
  )
}

/**
 * Tooltip component. Uses {@link createTooltip}.
 *
 * `props.children` should be a single element, otherwise the tooltip won't show up.
 *
 * @example
 * ```tsx
 * <ui.Tooltip label="Hello world!">
 *   <div>Hover me!</div>
 * </ui.Tooltip>
 * ```
 */
export function Tooltip(props: {
  label: s.JSXElement
  children: s.JSXElement
}): s.JSXElement {
  const children = s.children(() => props.children)

  /*
  use the last child el as the target
  because a lot of components return [<style />, <div />]...
  */
  const target = s.createMemo(() => {
    const child = children.toArray().at(-1)
    const el = child instanceof Element ? child : null
    return el
  })

  createTooltip(target, () => props.label)

  return <>{children()}</>
}

export const ToolTip = Tooltip
