import GlobalGuide from "../../components/Topic/GlobalGuide"
import GuideEdit from "../../components/Topic/GuideEdit"
import GuideSidebar from "../../components/Topic/GuideSidebar"
// import TitlePill from "../../components/Topic/TitlePill"
import TopicNav from "../../components/Topic/TopicNav"
import { useGlobalTopic } from "../../GlobalContext/global-topic"

export default function EditGuide() {
  const topic = useGlobalTopic()

  return (
    <>
      <style>{`
   #InfoSidebar {
    display: none;
  }
  #InfoMain {
    width: 100%;
  }
  #InfoOptions {
    display: none;
  }

@media (min-width: 700px) {
  #InfoSidebar {
    display: flex;
  }
  #InfoMain {
    width: 70%;
  }
  #InfoOptions {
    display: flex
  }
}
      `}</style>
      <div class="w-screen h-full text-black bg-white">
        <TopicNav />
        {/* <div class="w-full" style={{ padding: "24px 24px 0 24px" }}>
          <TitlePill />
        </div> */}

        <div class="h-full w-full flex justify-center">
          <div id="InfoSidebar" class="h-full w-[30%]">
            <GuideSidebar></GuideSidebar>
          </div>
          <div
            id="InfoMain"
            class="h-full bg-gray-50 dark:bg-neutral-800 w-full min-h-screen flex  gap-6 flex-col"
            style={{ padding: "24px 40px 24px 40px" }}
          >
            <GuideEdit />
          </div>
          {/* TODO: only here because commenting below block failed.. */}
          {/* add this when we have the data from server for who is learning the topic..  */}
        </div>
      </div>
    </>
  )
}
