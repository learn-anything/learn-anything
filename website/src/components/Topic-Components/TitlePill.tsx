export default function TitlePill() {
  return (
    <div
      class="w-full flex items-center justify-between rounded-full bg-[#F3F3F3]"
      style={{ padding: "8px 16px 8px 8px" }}
    >
      <div class="flex items-center justify-center gap-4">
        <div class="w-8 h-8 bg-neutral-200 rounded-full"></div>
        <div class="font-bold text-[20px] text-[#131313]">Topic</div>
        <div
          class="text-[#696969] flex items-center justify-center gap-2 text-[16px] leading-[18.78px] border-[#CCCCCC] border-[1px] rounded-[4px]"
          style={{ padding: "6px 10px 6px 10px" }}
        >
          <div>I</div>
          <div>To Learn</div>
        </div>
        <div
          class="text-[#696969] flex items-center justify-center gap-2 text-[16px] leading-[18.78px] border-[#CCCCCC] border-[1px] rounded-[4px]"
          style={{ padding: "6px 10px 6px 10px" }}
        >
          <div>I</div>
          <div>Learning</div>
        </div>
        <div
          class="text-[#696969] flex items-center justify-center gap-2 text-[16px] leading-[18.78px] border-[#CCCCCC] border-[1px] rounded-[4px]"
          style={{ padding: "6px 10px 6px 10px" }}
        >
          <div>I</div>
          <div>Learned</div>
        </div>
      </div>
      <div>options</div>
    </div>
  )
}
