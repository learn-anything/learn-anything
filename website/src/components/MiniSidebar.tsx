import useViewportChecker from "./TopicPage"

export default function MiniSidebar() {
  const myElement = useViewportChecker(["Links", "Notes", "Main"])

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
        <div class="border-l-2 flex flex-col h-fit py-2  text-sm font-semibold border-gray-500 border-opacity-20">
          <div class="opacity-60 flex flex-col gap-2">
            <div
              id={myElement() === "Main" ? "Active" : "Inactive"}
              class="px-3 cursor-pointer"
            >
              Main
            </div>
            <div
              id={myElement() === "Notes" ? "Active" : "Inactive"}
              class="px-3 cursor-pointer"
            >
              Notes
            </div>
            <div
              id={myElement() === "Links" ? "Active" : "Inactive"}
              class="px-3 cursor-pointer"
            >
              Links
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
