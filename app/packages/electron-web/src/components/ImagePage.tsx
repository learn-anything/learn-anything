import ImageContent from "./ImagePageComp/ImageContent.tsx"
import ImageSidebar from "./ImagePageComp/ImageSidebar.tsx"

export default function ImagePage() {
  return (
    <>
      <style>
        {`

        .Hoverable:hover {
         color: rgba(134, 239, 172, 1);
         transform: scale(1.1)
        }
        `}
      </style>
      <div class="w-screen flex flex-col h-screen bg-neutral-900">
        <div class="border-b border-slate-400 border-opacity-30 p-3 px-5 flex justify-between items-center">
          <div class="flex gap-5 font-bold ">
            <div class="Hoverable transition-all">Icon</div>
            <div class="Hoverable transition-all">Following</div>
            <div class="Hoverable transition-all">Discover</div>
          </div>
          <div class="flex items-center justify-center">
            <input
              type="text"
              placeholder="Search"
              class="rounded-full w-80 font-semibold focus:border-green-400 focus:border-opacity-70 p-1 px-5 outline-none bg-transparent border border-slate-400 border-opacity-50"
            />
          </div>
          <div class=" gap-5 p-2 flex font-bold items-center">
            <div class="Hoverable transition-all">Upload</div>
            <div class="p-4 w-12 flex items-center justify-center cursor-pointer h-12 rounded-full  border border-slate-400 border-opacity-50">
              PF
            </div>
          </div>
        </div>
        <div class="h-full flex">
          <ImageSidebar />
          <ImageContent />
        </div>
      </div>
    </>
  )
}
