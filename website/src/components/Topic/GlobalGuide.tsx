import GuideSection from "./GuideSection"
import GuideSummary from "./GuideSummary"

export default function GlobalGuide() {
  return (
    <>
      <GuideSummary />
      <GuideSection
        sectionTitle="Intro"
        links={[
          {
            title: "Learn Physics",
            url: "https://github.com/learn-anything/learn-anything.xyz",
            year: "2023",
          },
          {
            title: "Learn Physics",
            url: "https://github.com/learn-anything/learn-anything.xyz",
          },
          {
            title: "Learn Physics",
            url: "https://github.com/learn-anything/learn-anything.xyz",
          },
        ]}
      />
    </>
  )
}
