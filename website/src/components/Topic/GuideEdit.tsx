import { For } from "solid-js"
import GuideSection from "./GuideSection"
import GuideSummary from "./GuideSummary"
import GuideSummaryEdit from "./GuideSummaryEdit"
import { div } from "edgedb/dist/primitives/bigint"
import GuideSectionEdit from "./GuideSectionEdit"

export default function GuideEdit(props: any) {
  return (
    <>
      <GuideSummaryEdit />
      <For each={props.topics?.sections}>
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
