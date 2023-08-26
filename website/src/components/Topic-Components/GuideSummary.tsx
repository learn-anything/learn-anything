export default function GuideSummary() {
  return (
    <div class="w-full flex flex-col gap-4 text-[16px] leading-[18.78px]">
      <div class="flex justify-between items-center ">
        <div class="font-bold text-[#131313]">GUIDE</div>
        <div class="text-[#696969]">v1.0</div>
      </div>
      <div class="bg-[#FAFAFA] flex flex-col gap-2 rounded-[2px] p-4 w-full">
        <div class="flex justify-between items-center">
          <div class="text-[#696969] ">Summary</div>
          <div class="text-[#3B5CCC]">Expand</div>
        </div>
        <div class="text-[#696969] font-light">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem,
          dolor ratione est iste facilis et accusantium tempore eius, cumque aut
          voluptate veritatis in qui doloremque. Aspernatur aliquid et vitae
          sint.
        </div>
      </div>
      <div class="w-full flex justify-between items-center text-[#696969]">
        <div>Contents</div>
        <div class="flex gap-[23px]">
          <div>Duplicate</div>
          <div>Improve Guide</div>
          <div>Filter</div>
        </div>
      </div>
    </div>
  )
}
