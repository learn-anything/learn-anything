import GlobalGuide from "../../components/Topic/GlobalGuide"
// @ts-ignore
import { Motion } from "@motionone/solid"
import GuideSidebar from "../../components/Topic/GuideSidebar"
import TopicNav from "../../components/Topic/TopicNav"

export default function GlobalTopic() {
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
          width: 75%;
        }
        #InfoOptions {
          display: flex
        }
      }
      `}</style>
      <div class="w-screen h-full text-black dark:text-white bg-white dark:bg-neutral-900">
        <TopicNav />

        <div class="h-full w-full flex">
          <div
            id="InfoMain"
            class="h-full bg-white overflow-hidden dark:bg-neutral-900 min-h-screen flex  gap-6 flex-col"
            style={{ padding: "24px 20px 24px 20px" }}
          >
            <GlobalGuide />
          </div>
          <Motion.div
            id="InfoSidebar"
            class="h-full border-l border-[border-[#69696951] min-h-screen w-[25%] min-w-[250px]"
          >
            <GuideSidebar></GuideSidebar>
          </Motion.div>
          {/* TODO: only here because commenting below block failed.. */}
          {/* add this when we have the data from server for who is learning the topic..  */}
        </div>
      </div>
    </>
  )
}
