import Icon from "../Icon"

export default function TitlePill() {
  return (
    <div
      class="w-full flex items-center justify-between rounded-[8px]  bg-[#F3F3F3]"
      style={{ padding: "8px 16px 8px 16px" }}
    >
      <div class="flex items-center justify-center gap-4">
        {/* <div class="w-8 h-8 bg-neutral-200"></div> */}
        {/* TODO: should come from server */}
        <div class="font-bold text-[20px] text-[#131313]">Physics</div>
        <div
          class="cursor-pointer text-[#696969] flex items-center justify-center gap-1 text-[16px] leading-[18.78px] border-[#CCCCCC] border-[1px] rounded-[4px]"
          style={{ padding: "6px 10px 6px 10px" }}
        >
          <Icon name="Learn" />
          <div>To Learn</div>
        </div>
        <div
          class="cursor-pointer text-[#696969] flex items-center justify-center gap-1 text-[16px] leading-[18.78px] border-[#CCCCCC] border-[1px] rounded-[4px]"
          style={{ padding: "6px 10px 6px 10px" }}
        >
          <Icon name="Learn" />
          <div>Learning</div>
        </div>
        <div
          class="cursor-pointer text-[#696969] flex items-center justify-center gap-1 text-[16px] leading-[18.78px] border-[#CCCCCC] border-[1px] rounded-[4px]"
          style={{ padding: "6px 10px 6px 10px" }}
        >
          <Icon name="Learn" />
          <div>Learned</div>
        </div>
      </div>
      {/* <div>options</div> */}
    </div>
  )
}
