import { For, createResource } from "solid-js"
import { json, useParams } from "solid-start"

export default function Sidebar() {
  const params = useParams()

  const [sidebar] = createResource(
    () => params.topic,
    async () => {
      const res = await fetch(`http://127.0.0.1:3000/users/1/topics`)
      const jsonResponse = await res.json()
      console.log(jsonResponse, "topics")
      return jsonResponse
    }
  )

  return (
    <>
      <style>
        {`
       #SidebarContent::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 0;
        height: 0;
      }
    #DividerSmall {
      background: linear-gradient(#f6f6f7 10%,  rgba(30,30,32, 0))
    }
    @media (prefers-color-scheme: dark) {
      #DividerSmall {
        background:linear-gradient(rgb(22,22,24) 10%,  rgba(30,30,32, 0))
      }
    }
      `}
      </style>
      <div class=" h-full  w-full pt-1 pb-4">
        <div
          style={{ height: "8vh" }}
          class="flex items-center justify-start mx-6 px-2 font-semibold text-lg border-b-2 border-gray-400 border-opacity-20"
        >
          <div class="opacity-60">Wiki</div>
        </div>
        <div class="relative w-full">
          <div
            id="DividerSmall"
            class="absolute top-0 left-0 w-full p-4 z-20"
          ></div>
          <div
            id="SidebarContent"
            style={{ height: "92vh" }}
            class="opacity-60 relative font-semibold overflow-auto px-4 py-5 w-full"
          >
            <div class="px-2">
              <For each={sidebar()} fallback={<div>Loading...</div>}>
                {(topic) => {
                  return <div>{topic.name}</div>
                }}
              </For>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
