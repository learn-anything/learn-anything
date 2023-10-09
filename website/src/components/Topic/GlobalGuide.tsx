import { For, Show } from "solid-js"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import Icon from "../Icon"
import GuideSummary from "./GuideSummary"
// @ts-ignore
import { Motion } from "@motionone/solid"
import { useNavigate } from "solid-start"
import GuideSection from "./GuideSection"

export default function GlobalGuide() {
  const navigate = useNavigate()
  const topic = useGlobalTopic()

  return (
    <>
      <div class="w-full h-full flex flex-col gap-[20px]">
        <div
          id="Guide"
          class="font-bold h-full  flex w-full items-center justify-between"
        >
          <div class="text-[22px]">Guide</div>
          <div class="flex h-full gap-4">
            <Motion.div
              transition={{ duration: 1.2, easing: "ease-out" }}
              animate={{
                opacity: [0, 1, 1],
                transform: [
                  "translateX(100px)",
                  "translateX(-10px)",
                  "translateX(0px)",
                ],
              }}
              class="border border-[#69696951] flex items-center justify-center bg-opacity-40 text-[#696969]  hover:bg-gray-100 transition-all px-3 font-light rounded-[4px] text-[14px] p-1 cursor-pointer"
            >
              Filter
            </Motion.div>
            <Motion.div
              onClick={() => {
                // TODO: probably unsafe, should be a better way to do this
                const topicName = window.location.href.split("/")[3]
                console.log(topicName)
                navigate(`/${topicName}/edit`)
              }}
              transition={{ duration: 1, easing: "ease-out", delay: 0.1 }}
              animate={{
                opacity: [0, 1, 1],
                transform: [
                  "translateX(100px)",
                  "translateX(-10px)",
                  "translateX(0px)",
                ],
              }}
              class="bg-blue-600 flex items-center justify-center bg-opacity-40 text-blue-600 hover:text-white hover:bg-blue-600 transition-all px-3 font-light rounded-[4px] text-[14px] p-1 cursor-pointer"
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
              class="bg-gray-100 dark:bg-neutral-950 hover:bg-gray-200 transition-all flex items-center justify-center rounded-[4px] h-[29px] w-[29px] text-[14px] cursor-pointer"
            >
              <Icon name="Options" />
            </Motion.div>
          </div>
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
          class="px-6 outline-none hover:bg-gray-100 hover:dark:bg-black dark:bg-neutral-950 transition-all focus:bg-gray-200 dark:focus:bg-black rounded-[4px] bg-gray-50 p-3 w-full"
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
        class="w-full h-full bg-gray-50 dark:bg-neutral-950 rounded-[6px] p-4"
      >
        <GuideSummary />
        <Show when={topic.globalTopic.latestGlobalGuide}>
          {/* @ts-ignore */}
          <For each={topic.globalTopic.latestGlobalGuide.sections}>
            {(section) => {
              return (
                <GuideSection title={section.title} links={section.links} />
              )
            }}
          </For>
        </Show>
      </Motion.div>
    </>
  )
}
