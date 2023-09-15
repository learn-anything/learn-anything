import { Match, Show, Switch, onMount } from "solid-js"
import { signedIn } from "../../../lib/auth"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import Card from "../../components/Topic/Card"
import GlobalGuide from "../../components/Topic/GlobalGuide"
import GuideLinks from "../../components/Topic/GuideLinks"
import GuideNotes from "../../components/Topic/GuideNotes"
import TitlePill from "../../components/Topic/TitlePill"
import TopicNav from "../../components/Topic/TopicNav"
import { useMobius } from "../../root"

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
          width: 65%;
        }
        #InfoOptions {
          display: flex
        }
      }
      `}</style>
      <div class="w-screen h-full text-black bg-white">
        <TopicNav />
        {/* <Modal>
          <Create></Create>
        </Modal> */}
        <div class="w-full" style={{ padding: "24px 24px 0 24px" }}>
          <TitlePill />
        </div>
        <div
          id="InfoOptions"
          class="w-full flex gap-8 text-lg font-light"
          style={{ padding: "24px 40px 0 40px" }}
        >
          <div
            onClick={() => {
              topic.setShowPage("Global Guide")
            }}
            class="border-b-2 border-black cursor-pointer"
          >
            Global Guide
          </div>
          <div
            class="cursor-pointer"
            onClick={() => {
              topic.setShowPage("Global Guide")
            }}
          >
            Personal Guide
          </div>
          <div
            class="cursor-pointer"
            onClick={() => {
              topic.setShowPage("Links")
            }}
          >
            Links
          </div>
          <div
            class="cursor-pointer"
            onClick={() => {
              topic.setShowPage("Notes")
            }}
          >
            Notes
          </div>
        </div>
        <div class="h-fit w-full flex justify-center">
          <div
            id="InfoMain"
            class="h-full min-h-screen flex gap-6 flex-col"
            style={{ padding: "24px 40px 24px 40px" }}
          >
            {/* <Show when={false} fallback={<GuideEdit topics={topics()} />}>
              <Guide />
            </Show> */}
            <Switch>
              <Match when={topic.globalTopic.showPage === "Global Guide"}>
                <GlobalGuide />
              </Match>
              <Match when={topic.globalTopic.showPage === "Links"}>
                <GuideLinks />
              </Match>
              <Match when={topic.globalTopic.showPage === "Notes"}>
                <GuideNotes />
              </Match>
            </Switch>
          </div>
          {/* TODO: only here because commenting below block failed.. */}
          {/* add this when we have the data from server for who is learning the topic..  */}
          <div
            id="InfoSidebar"
            class="h-full w-[35%] flex flex-col gap-6 overflow-auto"
            style={{ padding: "24px 40px 24px 0px" }}
          >
            <div class="flex flex-col w-full gap-2 font-light text-[#6B6B70]">
              <div class="flex justify-between">
                <div
                  class="flex items-center gap-1 text-[#3B5CCC] font-light"
                  // onClick={}
                >
                  {/* <Icon name="Plus"></Icon>Add Section */}
                </div>
              </div>

              {/* <For each={topic.topic.guideSections}>
                {(section) => {
                  // TODO: clicking on ection, should jump to that section in focus
                  return <div>{section.title}</div>
                }}
              </For> */}
            </div>
            <div id="Cards" class="flex flex-col gap-2">
              {/* TODO:  */}
              {/* <Card name="Interactive Graph" /> */}
              {/* <Show when={topic.topic.learners.length > 0}> */}
              <Show when={true}>
                <Card name="Learners" />
              </Show>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
