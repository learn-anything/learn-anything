import { Match, Show, Switch, createSignal } from "solid-js"
import { Icon, ToolTip } from "."
import clsx from "clsx"

interface Props {
  onClick: () => void
  icon: "Bookmark" | "In Progress" | "Completed" | "Liked"
  activeIcon: boolean
}

export function IconButton(props: Props) {
  const [statusChanging, setStatusChanging] = createSignal(false)
  return (
    <>
      <Switch>
        <Match when={props.icon === "Bookmark"}>
          <ToolTip label="Bookmark">
            <div
              onClick={async () => {
                setStatusChanging(true)
                await props.onClick()
                setStatusChanging(false)
              }}
              class={clsx(
                "animate-[iconSlide_0.8s_ease-out_forwards] cursor-pointer rounded-[4px] active:scale-[1.2] active:bg-blue-500 hover:[&>*]:scale-[0.9] transition-all h-[26px] w-[26px] border-light dark:border-dark",
                props.activeIcon &&
                  "bg-blue-500 border-none transition-all !flex-center"
              )}
            >
              <Show
                when={statusChanging()}
                fallback={
                  <Icon
                    name="Bookmark"
                    fill="white"
                    border={props.activeIcon ? "red" : "black"}
                  />
                }
              >
                <div class="flex-center w-full h-full">
                  <Icon width="16" height="16" name="Loader" border="white" />
                </div>
              </Show>
            </div>
          </ToolTip>
        </Match>
        <Match when={props.icon === "In Progress"}>
          <ToolTip label="In Progress">
            <div
              onClick={async () => {
                setStatusChanging(true)
                await props.onClick()
                setStatusChanging(false)
              }}
              class={clsx(
                "animate-[iconSlide_0.8s_ease-out_forwards] cursor-pointer rounded-[4px] active:scale-[1.2] active:bg-blue-500 hover:[&>*]:scale-[0.9] transition-all h-[26px] w-[26px] border-light dark:border-dark",
                props.activeIcon &&
                  "bg-blue-500 border-none transition-all !flex-center"
              )}
            >
              <Show
                when={statusChanging()}
                fallback={
                  <Icon
                    name="Hourglass"
                    fill="white"
                    border={props.activeIcon ? "red" : "black"}
                  />
                }
              >
                <div class="flex-center w-full h-full">
                  <Icon width="16" height="16" name="Loader" border="white" />
                </div>
              </Show>
            </div>
          </ToolTip>
        </Match>
        <Match when={props.icon === "Completed"}>
          <ToolTip label="Completed">
            <div
              onClick={async () => {
                setStatusChanging(true)
                await props.onClick()
                setStatusChanging(false)
              }}
              class={clsx(
                "animate-[iconSlide_0.8s_ease-out_forwards] cursor-pointer rounded-[4px] active:scale-[1.2] active:bg-blue-500 hover:[&>*]:scale-[0.9] transition-all h-[26px] w-[26px] border-light dark:border-dark",
                props.activeIcon &&
                  "bg-blue-500 border-none transition-all !flex-center"
              )}
            >
              <Show
                when={statusChanging()}
                fallback={<Icon name="Checkmark" width="24" height="24" />}
              >
                <div class="flex-center w-full h-full">
                  <Icon width="16" height="16" name="Loader" border="white" />
                </div>
              </Show>
            </div>
          </ToolTip>
        </Match>
        <Match when={props.icon === "Liked"}>
          <ToolTip label="Liked">
            <div
              onClick={async () => {
                setStatusChanging(true)
                await props.onClick()
                setStatusChanging(false)
              }}
              class={clsx(
                "cursor-pointer rounded-[4px] animate-[iconSlide_0.2s_ease-out_forwards] hover:opacity-50 transition-all h-[26px] w-[26px] border-light dark:border-dark",
                props.activeIcon &&
                  "bg-red-500 border-none transition-all !flex-center"
              )}
            >
              <Show
                when={statusChanging()}
                fallback={
                  <Icon
                    name="Heart"
                    fill="white"
                    border={props.activeIcon ? "red" : "black"}
                  />
                }
              >
                <div class="flex-center w-full h-full">
                  <Icon width="16" height="16" name="Loader" border="white" />
                </div>
              </Show>
            </div>
          </ToolTip>
        </Match>
      </Switch>
    </>
  )
}
