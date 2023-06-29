export default function MiniSidebar() {
  return (
    <>
      <style>
        {`
        #Active {
          border-left: solid 3px #22e055;
          font-weight: 800;
          margin-left: -3px;
        }
        #Inactive {
          border: none;
          font-weight: 600;
          margin-left: -3px;
        }
    `}
      </style>
      <div class="h-full pt-10">
        <div class="border-l-2 flex flex-col  py-1  text-sm font-semibold border-gray-500 h-1/4 border-opacity-20">
          <div class="opacity-60 flex flex-col gap-2">
            <div id="Inactive" class="px-3 cursor-pointer">
              thing
            </div>
            <div id="Inactive" class="px-3 cursor-pointer">
              another thing
            </div>
            <div id="Inactive" class="px-3 cursor-pointer">
              something
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
