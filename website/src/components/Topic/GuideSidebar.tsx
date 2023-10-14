import { For } from "solid-js"
import { useGlobalState } from "../../GlobalContext/global"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import FancyButton from "../FancyButton"
import Card from "./Card"

export default function GuideSidebar() {
  const topic = useGlobalTopic()
  const global = useGlobalState()
  // Title , Status , Info , Resources , Learners
  return (
    <>
      <div
        class="w-full flex flex-col gap-[32px] h-full dark:text-white text-black"
        style={{ padding: "24px 20px 24px 20px" }}
      >
        <div id="Status" class="flex flex-col gap-2">
          <div class="font-bold text-[#696969] text-[14px]">TOPIC STATUS</div>
          <div class="flex gap-2">
            <FancyButton
              onClick={() => {
                if (topic.globalTopic.learningStatus === "to-learn") {
                  topic.set("learningStatus", "")
                } else {
                  topic.set("learningStatus", "to-learn")
                }
              }}
              active={topic.globalTopic.learningStatus === "to-learn"}
            >
              To Learn
            </FancyButton>
            <FancyButton
              onClick={() => {
                if (topic.globalTopic.learningStatus === "learning") {
                  topic.set("learningStatus", "")
                } else {
                  topic.set("learningStatus", "learning")
                }
              }}
              active={topic.globalTopic.learningStatus === "learning"}
            >
              Learning
            </FancyButton>
            <FancyButton
              onClick={() => {
                if (topic.globalTopic.learningStatus === "learned") {
                  topic.set("learningStatus", "")
                } else {
                  topic.set("learningStatus", "learned")
                }
              }}
              active={topic.globalTopic.learningStatus === "learned"}
            >
              Learned
            </FancyButton>
          </div>
        </div>
        <div id="Info" class="text-[#696969] flex flex-col gap-3">
          <div class="font-bold">{topic.globalTopic.prettyName}</div>
          <div class="text-[14px] pl-3 flex flex-col gap-2">
            <For each={topic.globalTopic.latestGlobalGuide.sections}>
              {(section) => {
                return (
                  <>
                    <div>{section.title}</div>
                  </>
                )
              }}
            </For>
          </div>
        </div>
        <div id="Resources" class="flex text-[#696969] flex-col gap-3">
          <div class="font-bold">Resources</div>
          <div class="flex flex-col pl-3 text-[14px] gap-[6px]">
            <div
              class="flex gap-2 cursor-pointer"
              onClick={() => {
                global.setGuidePage("Guide")
              }}
            >
              Guide <span class="font-bold">{}</span>
            </div>
            <div
              class="flex gap-2 cursor-pointer"
              onClick={() => {
                global.setGuidePage("Links")
              }}
            >
              Links{" "}
              <span class="font-bold">{topic.globalTopic.links.length}</span>
            </div>
            {/* <div class="flex gap-2">
              Notes <span class="font-bold">24</span>
            </div> */}
          </div>
        </div>
        <div id="Learners" class="text-[#696969]">
          <Card name="Learners"></Card>
        </div>
      </div>
    </>
  )
}
