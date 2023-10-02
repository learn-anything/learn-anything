import { For } from "solid-js"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import GuideSection from "./GuideSection"
import GuideSummary from "./GuideSummary"
import Icon from "../Icon"

export default function GlobalGuide() {
  const topic = useGlobalTopic()

  return (
    <>
      <div
        id="Guide"
        class="font-bold h-full  flex w-full items-center justify-between"
      >
        <div class="text-[22px]">Guide</div>
        <div class="flex h-full gap-4">
          <div class="bg-blue-600 flex items-center justify-center bg-opacity-40 text-blue-600 hover:text-white hover:bg-blue-600 transition-all px-3 font-light rounded-[4px] text-[14px] p-1">
            Improve Guide
          </div>
          <div class="bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center rounded-[4px] h-[29px] w-[29px] text-[14px]">
            <Icon name="Options" />
          </div>
        </div>
      </div>
      <div class="w-full">
        <input
          type="text"
          placeholder="Search"
          class="px-6 outline-none hover:bg-gray-100 transition-all focus:bg-gray-200 rounded-[4px] bg-gray-50 p-3 w-full"
        />
      </div>
      <div class="w-full h-full bg-gray-50 rounded-[6px] p-4">
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
