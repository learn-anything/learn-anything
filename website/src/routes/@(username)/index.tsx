import { For, Match, Show, Switch } from "solid-js"
import TopicNav from "../../components/Topic/TopicNav"
import TitlePill from "../../components/Topic/TitlePill"
import Guide from "../../components/Topic/Guide"
import Card from "../../components/Topic/Card"
import { useTopic } from "../../GlobalContext/topic"
// import ProfilePage from "../../components/ProfilePage"

export default function UserProfile() {
  const topic = useTopic()
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

        <div class="h-fit w-full flex justify-center">
          <div
            id="InfoMain"
            class="h-full min-h-screen flex gap-6 flex-col"
            style={{ padding: "24px 40px 24px 40px" }}
          >
            {/* <Show when={false} fallback={<GuideEdit topics={topics()} />}>
            <Guide />
          </Show> */}
            {/* <ProfilePage /> */}
            {/* <Switch>
            <Match when={topic.topic.showPage === "Global Guide"}>

            </Match>
            <Match when={topic.topic.showPage === "Links"}>
              <GuideLinks />
            </Match>
            <Match when={topic.topic.showPage === "Notes"}>
              <GuideNotes />
            </Match>
            <Match when={topic.topic.showPage === "Edit Global Guide"}>
              <GuideEdit />
            </Match>
          </Switch> */}
          </div>
          <div
            id="InfoSidebar"
            class="h-full w-[35%] flex flex-col gap-6 overflow-auto"
            style={{ padding: "24px 40px 24px 0px" }}
          >
            <div id="Cards" class="flex flex-col gap-2">
              {/* TODO:  */}
              {/* <Card name="Interactive Graph" /> */}
              {/* <Show when={topic.topic.learners.length > 0}> */}
              <Show when={true}>
                <Card name="Suggested" />
              </Show>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
