import { useTopic } from "../../GlobalContext/topic"
import Icon from "../Icon"
import clsx from "clsx"

export default function TitlePill() {
  const topic = useTopic()
  return (
    <div
      class="w-full flex items-center justify-between rounded-[8px] border border-slate-400 border-opacity-50"
      style={{ padding: "8px 16px 8px 16px" }}
    >
      <div class="font-bold text-[20px] text-[#131313]">
        {topic.topic.prettyName}
      </div>
      <div class="flex items-center justify-center gap-4">
        {/* <div class="w-8 h-8 bg-neutral-200"></div> */}
        {/* TODO: should come from server */}
        <div
          onClick={() => {
            topic.setLearningStatus("to learn")
          }}
          class={clsx(
            "px-[10px] p-[6px] pl-[4.5px] active:scale-[1.03] cursor-pointer text-[#696969] flex items-center justify-center gap-1 text-[16px] leading-[18.78px] border-[#CCCCCC] border-[1px] rounded-[6px] hover:bg-blue-500 hover:text-white transition-all",
            topic.topic.status === "to learn" &&
              "text-white border-none bg-blue-500",
          )}
        >
          <Icon name="Learn" />
          <div>To Learn</div>
        </div>
        <div
          onClick={() => {
            topic.setLearningStatus("learning")
          }}
          class={clsx(
            "px-[10px] p-[6px] pl-[4.5px] active:scale-[1.03] cursor-pointer text-[#696969] flex items-center justify-center gap-1 text-[16px] leading-[18.78px] border-[#CCCCCC] border-[1px] rounded-[6px]  hover:bg-blue-500 hover:text-white transition-all",
            topic.topic.status === "learning" &&
              "bg-blue-500 text-white border-none",
          )}
        >
          <Icon name="Learn" />
          <div>Learning</div>
        </div>
        <div
          onClick={() => {
            topic.setLearningStatus("learned")
          }}
          class={clsx(
            "px-[10px] p-[6px] pl-[4.5px] active:scale-[1.03] cursor-pointer text-[#696969] flex items-center justify-center gap-1 text-[16px] leading-[18.78px] border-[#CCCCCC] border-[1px] rounded-[6px]  hover:bg-blue-500 hover:text-white transition-all",
            topic.topic.status === "learned" &&
              "bg-blue-500 text-white border-none",
          )}
        >
          <Icon name="Learn" />
          <div>Learned</div>
        </div>
      </div>
      {/* <div>options</div> */}
    </div>
  )
}
