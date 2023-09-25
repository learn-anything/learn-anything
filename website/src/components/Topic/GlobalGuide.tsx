import { For } from "solid-js"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import GuideSection from "./GuideSection"
import GuideSummary from "./GuideSummary"

export default function GlobalGuide() {
  const topic = useGlobalTopic()

  return (
    <>
      <div
        id="Guide"
        class="font-bold h-full flex w-full items-center justify-between"
      >
        <div class="text-[22px]">Guide</div>
        <div class="flex h-full gap-4">
          <div class="bg-blue-600 flex items-center justify-center bg-opacity-40 text-blue-600 px-3 font-light rounded-[4px] text-[14px] p-1">
            Improve Guide
          </div>
          <div class="bg-gray-200 flex items-center justify-center rounded-[4px] h-[29px] w-[29px] text-[14px]">
            Op
          </div>
        </div>
      </div>
      <div class="w-full h-full bg-white rounded-[6px] p-4">
        <GuideSummary />
        <For each={topic.globalTopic.globalGuide.sections}>
          {(section) => {
            return <GuideSection title={section.title} links={section.links} />
          }}
        </For>
      </div>
    </>
  )
}
