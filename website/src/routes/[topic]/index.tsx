import { Match, Show, Switch, onMount } from "solid-js"
import { signedIn } from "../../../lib/auth"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import Card from "../../components/Topic/Card"
import GlobalGuide from "../../components/Topic/GlobalGuide"
import GuideLinks from "../../components/Topic/GuideLinks"
import GuideNotes from "../../components/Topic/GuideNotes"

import TopicNav from "../../components/Topic/TopicNav"
import { useMobius } from "../../root"
import GuideSidebar from "../../components/Topic/GuideSidebar"

export default function GlobalTopic() {
  const topic = useGlobalTopic()
  const mobius = useMobius()

  // TODO: avoid this as there is same onMount in [topic]/edit.tsx
  // there should be only one in theory
  // if you go from /index to /edit, get the data from global store, don't do another request for data already there
  onMount(async () => {
    if (signedIn()) {
      const globalTopic = await mobius.query({
        getGlobalTopic: {
          where: {
            // TODO: get topic name from route
            topicName: "3d-printing",
          },
          select: {
            prettyName: true,
            topicSummary: true,
            // learningStatus: true,
          },
        },
      })
      console.log(globalTopic, "global topic (signed in)")
      if (globalTopic !== null) {
        // @ts-ignore
        topic.set(globalTopic.data.getGlobalTopic)
      }
    } else {
      const globalTopicPublic = await mobius.query({
        publicGetGlobalTopic: {
          where: {
            topicName: "3d-printing",
          },
          select: {
            name: true,
            prettyName: true,
            topicSummary: true,
          },
        },
      })
      console.log(topic, "global topic (not signed in)")
      if (globalTopicPublic !== null) {
        // @ts-ignore
        topic.set(globalTopic.data.getGlobalTopic)
      }
    }
  })

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
      <div class="w-screen h-full text-black bg-white dark:bg-neutral-900">
        <TopicNav />

        <div class="h-full w-full flex justify-center">
          <div id="InfoSidebar" class="h-full w-[30%]">
            <GuideSidebar></GuideSidebar>
          </div>
          <div
            id="InfoMain"
            class="h-full bg-white border-l-[0.5px] border-[#69696951] dark:bg-neutral-800 w-full min-h-screen flex  gap-6 flex-col"
            style={{ padding: "24px 40px 24px 40px" }}
          >
            <GlobalGuide />
          </div>
          {/* TODO: only here because commenting below block failed.. */}
          {/* add this when we have the data from server for who is learning the topic..  */}
        </div>
      </div>
    </>
  )
}
