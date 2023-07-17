import { For, createSignal } from "solid-js"

export default function ImageContent() {
  const [topicImage, setTopicImage] = createSignal([
    "Math",
    "Science",
    "Astrology",
    "Valorant",
    "Minecraft",
    "IDFK",
  ])
  return (
    <>
      <div class="w-full p-5 h-full">
        <div class="w-full h-full grid grid-cols-3 gap-4">
          <For each={topicImage()}>
            {(topic) => (
              <div class="border border-slate-400 border-opacity-50 flex items-center justify-center rounded-lg h-full">
                {topic}
              </div>
            )}
          </For>
        </div>
      </div>
    </>
  )
}
