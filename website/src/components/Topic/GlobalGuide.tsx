import { For } from "solid-js"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import GuideSection from "./GuideSection"
import GuideSummary from "./GuideSummary"

export default function GlobalGuide() {
  const topic = useGlobalTopic()

  return (
    <>
      <GuideSummary />
      <For each={topic.globalTopic.globalGuide.sections}>
        {(section) => {
          return <GuideSection title={section.title} links={section.links} />
        }}
      </For>
    </>
  )
}
