import GuideSummaryEdit from "./GuideSummaryEdit"

export default function GuideEdit() {
  return (
    <>
      <GuideSummaryEdit />
      {/* <For each={topic.topic.guideSections}>
        {(section) => {
          return (
            <GuideSectionEdit
              sectionTitle={section.title}
              links={section.links}
            />
          )
        }}
      </For> */}
    </>
  )
}
