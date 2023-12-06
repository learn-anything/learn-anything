import { Show, createSignal, onMount } from "solid-js"
import { useGlobalTopic } from "../../GlobalContext/global-topic"

interface Props {}

export default function GuideSummary(props: Props) {
  const [showSummary, setShowSummary] = createSignal(false)
  const topic = useGlobalTopic()

  return (
    <>
      <Show
        when={
          !(
            topic.globalTopic.topicSummary === "<p></p>" ||
            topic.globalTopic.topicSummary === ""
          )
        }
      >
        <div class="w-full flex-col gap-3 text-[16px] bg-white dark:bg-neutral-900 dark:border-[#282828] border-[#69696951] border-[0.5px] rounded-[6px] p-4 px-4  leading-[18.78px]">
          {/* <div class=" text-black dark:text-white text-opacity-70 flex w-full justify-between">
          <div>Version</div>
        </div> */}
          <div
            id={
              showSummary() ? "GuideSummaryExpanded" : "GuideSummaryMinimised"
            }
            class="bg-white dark:bg-inherit font-light flex-col gap-2 rounded-[2px] w-full"
          >
            <div class="flex-between">
              <Show when={topic.globalTopic.topicSummary}>
                <div
                  class="text-[#696969]"
                  innerHTML={topic.globalTopic.topicSummary}
                />
              </Show>
              <div
                class="text-[#3B5CCC] cursor-pointer select-none"
                onClick={() => {
                  setShowSummary(!showSummary())
                }}
              >
                {/* don't show minimise/expand if summary is less than 30 words */}
                {/* <Show when={topic.topic.guideSummary.split(/\s+/).length > 30}>
                <Show when={showSummary()} fallback={<div>Expand</div>}>
                  Minimise
                </Show>
              </Show> */}
              </div>
            </div>
            {/* <div class="text-[#696969] font-light overflow-hidden text-ellipsis">
            {topic.topic.guideSummary}
          </div> */}
          </div>
        </div>
      </Show>
    </>
  )
}
