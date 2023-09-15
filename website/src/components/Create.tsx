export default function Create() {
  return (
    <div class="w-full h-full flex z-50 items-center justify-center bg-[#F4F5F6]">
      <div class="bg-white rounded-lg flex w-[50%] gap-5 p-3">
        <div class="w-full flex flex-col gap-8">
          <input
            type="text"
            placeholder="Event Name"
            class="bg-transparent text-[#8E8F90] text-[32px]"
          />
          <div>
            <div class="bg-[#F6F6F6] rounded-lg w-full p-2 text-black text-opacity-50 font-semibold">
              event Location
            </div>
          </div>
          <div class="bg-black text-white p-2 flex items-center justify-center px-4 rounded-lg">
            Create Event
          </div>
        </div>
        <div class="w-full"></div>
      </div>
    </div>
  )
}
