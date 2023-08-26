import GuideOption from "../components/Topic-Components/GuideOption"
import GuideSummary from "../components/Topic-Components/GuideSummary"
import TitlePill from "../components/Topic-Components/TitlePill"
import TopicNav from "../components/Topic-Components/TopicNav"

export default function Topic() {
  return (
    <>
      <style>{``}</style>
      <div class="w-screen h-full text-black bg-white">
        <TopicNav />
        <div class="w-full" style={{ padding: "24px 24px 0 24px" }}>
          <TitlePill />
        </div>
        <div class="h-full w-full flex justify-center">
          <div
            class="h-full w-[65%] flex gap-6 flex-col"
            style={{ padding: "24px 40px 24px 40px" }}
          >
            <GuideSummary />
            <GuideOption />
            <GuideOption />
          </div>
          <div
            class="h-full w-[35%] flex flex-col gap-6"
            style={{ padding: "24px 40px 24px 0px" }}
          >
            <div class="w-full h-[436px] border border-[#EAEAEA] rounded-[4px]"></div>
            <div class="w-full h-[303px] border border-[#EAEAEA] rounded-[4px]"></div>
          </div>
        </div>
      </div>
    </>
  )
}
