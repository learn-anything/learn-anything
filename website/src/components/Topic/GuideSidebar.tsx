import Card from "./Card"

export default function GuideSidebar() {
  // Title , Status , Info , Resources , Learners
  return (
    <>
      <div
        class="w-full flex flex-col gap-[32px] h-full dark:text-white text-black"
        style={{ padding: "24px 20px 24px 20px" }}
      >
        <div id="Title" class="flex items-center gap-3">
          <div class="w-[30px] h-[30px] bg-neutral-200 rounded-full"></div>
          <div>title</div>
        </div>
        <div id="Status" class="flex flex-col gap-2">
          <div class="font-bold text-[#696969] text-[14px]">TOPIC STATUS</div>
          <div class="flex gap-2">
            <div class="px-[6px] text-[14px] p-[4px] active:scale-[1.03] active:border-none cursor-pointer text-[#696969] dark:border-opacity-30 flex items-center justify-center gap-1 leading-[18.78px] border-[#CCCCCC] border-[1px] rounded-[6px] hover:bg-black hover:text-white transition-all">
              To Learn
            </div>
            <div class="px-[6px] text-[14px] p-[4px] active:scale-[1.03] active:border-none cursor-pointer text-[#696969] dark:border-opacity-30 flex items-center justify-center gap-1 leading-[18.78px] border-[#CCCCCC] border-[1px] rounded-[6px] hover:bg-black hover:text-white transition-all">
              Learning
            </div>
            <div class="px-[6px] text-[14px] p-[4px] active:scale-[1.03] active:border-none cursor-pointer text-[#696969] dark:border-opacity-30 flex items-center justify-center gap-1 leading-[18.78px] border-[#CCCCCC] border-[1px] rounded-[6px] hover:bg-black hover:text-white transition-all">
              Learned
            </div>
          </div>
        </div>
        <div id="Info" class="text-[#696969] flex flex-col gap-3">
          <div class="font-bold">Topic Title</div>
          <div class="text-[14px] pl-3 flex flex-col gap-2">
            <div class="">Topic Info</div>
            <div class="">Topic Info</div>
            <div class="">Topic Info</div>
          </div>
        </div>
        <div id="Resources" class="flex text-[#696969] flex-col gap-3">
          <div class="font-bold">Resources</div>
          <div class="flex flex-col pl-3 text-[14px] gap-[6px]">
            <div class="flex gap-2">
              Links <span class="font-bold">10</span>
            </div>
            <div class="flex gap-2">
              Notes <span class="font-bold">24</span>
            </div>
          </div>
        </div>
        <div id="Learners" class="text-[#696969]">
          <Card name="Learners"></Card>
        </div>
      </div>
    </>
  )
}
