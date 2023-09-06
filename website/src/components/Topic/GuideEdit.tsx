import { For } from "solid-js"
import GuideSummaryEdit from "./GuideSummaryEdit"
import GuideSectionEdit from "./GuideSectionEdit"
import { useTopic } from "../../GlobalContext/topic"

export default function GuideEdit() {
  const topic = useTopic()
  return (
    <>
      <GuideSummaryEdit />
      <For each={topic.topic.guideSections}>
        {(section) => {
          return (
            <GuideSectionEdit
              sectionTitle={section.title}
              links={section.links}
            />
          )
        }}
      </For>
    </>
  )
}
