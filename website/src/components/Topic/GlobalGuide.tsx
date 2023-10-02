import { For } from "solid-js"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import GuideSection from "./GuideSection"
import GuideSummary from "./GuideSummary"
import Icon from "../Icon"
import { Motion } from "@motionone/solid"

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
          <Motion.div
            transition={{ duration: 1, easing: "ease-out" }}
            animate={{
              opacity: [0, 1, 1],
              transform: [
                "translateX(100px)",
                "translateX(-10px)",
                "translateX(0px)",
              ],
            }}
            class="bg-blue-600 flex items-center justify-center bg-opacity-40 text-blue-600 hover:text-white hover:bg-blue-600 transition-all px-3 font-light rounded-[4px] text-[14px] p-1"
          >
            Improve Guide
          </Motion.div>
          <Motion.div
            transition={{ duration: 1, easing: "ease-out", delay: 0.2 }}
            animate={{
              opacity: [0, 1, 1],
              transform: [
                "translateX(100px)",
                "translateX(-10px)",
                "translateX(0px)",
              ],
            }}
            class="bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center rounded-[4px] h-[29px] w-[29px] text-[14px]"
          >
            <Icon name="Options" />
          </Motion.div>
        </div>
      </div>
      <Motion.div
        transition={{ duration: 0.8, easing: "ease-out" }}
        animate={{
          opacity: [0, 1, 1],
          transform: [
            "translateX(100px)",
            "translateX(-10px)",
            "translateX(0px)",
          ],
        }}
        class="w-full"
      >
        <input
          type="text"
          placeholder="Search"
          class="px-6 outline-none hover:bg-gray-100 transition-all focus:bg-gray-200 rounded-[4px] bg-gray-50 p-3 w-full"
        />
      </Motion.div>
      <Motion.div
        transition={{ duration: 1, easing: "ease-out" }}
        animate={{
          opacity: [0, 1, 1],
          transform: [
            "translateX(100px)",
            "translateX(-10px)",
            "translateX(0px)",
          ],
        }}
        class="w-full h-full bg-gray-50 rounded-[6px] p-4"
      >
        <GuideSummary />
        <For each={topic.globalTopic.globalGuide.sections}>
          {(section) => {
            return <GuideSection title={section.title} links={section.links} />
          }}
        </For>
      </Motion.div>
    </>
  )
}
