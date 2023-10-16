import EditGlobalGuide from "../../components/Topic/EditGlobalGuide"
import EditGuideSidebar from "../../components/Topic/EditGuideSidebar"
import GuideNav from "../../components/Topic/GuideNav"

export default function EditGuide() {
  return (
    <>
      <style>{`
        #InfoSidebar {
          display: none;
        }

        #InfoMain::-webkit-scrollbar {
          display: none;
        }
        #InfoOptions {
          display: none;
        }

      @media (min-width: 700px) {
        #InfoSidebar {
          display: flex;
        }

        #InfoOptions {
          display: flex
        }
      }
      `}</style>
      <div class="w-screen fixed top-0 right-0 h-screen text-black dark:text-white bg-white dark:bg-[#1C1C1C]">
        <GuideNav />
        {/* <div class="w-full" style={{ padding: "24px 24px 0 24px" }}>
          <TitlePill />
        </div> */}

        <div class="h-[90%] w-full flex">
          <div
            id="InfoMain"
            class="h-full bg-white overflow-auto w-full dark:bg-[#1C1C1C] flex  gap-6 flex-col"
            style={{ padding: "24px 20px 24px 20px" }}
          >
            <EditGlobalGuide />
          </div>
          <div
            id="InfoSidebar"
            class="  dark:bg-[#161616] bg-[#F4F4F6] border-l-[0.5px] border-[#69696951] h-full w-[25%] min-w-[250px]"
          >
            {/* <GuideSidebar></GuideSidebar> */}
            <EditGuideSidebar />
          </div>
          {/* TODO: only here because commenting below block failed.. */}
          {/* add this when we have the data from server for who is learning the topic..  */}
        </div>
      </div>
    </>
  )
}
