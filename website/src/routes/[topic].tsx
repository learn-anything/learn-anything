import { For, Match, Show, Switch, onMount } from "solid-js"
import TitlePill from "../components/Topic/TitlePill"
import TopicNav from "../components/Topic/TopicNav"
import Guide from "../components/Topic/Guide"
import Card from "../components/Topic/Card"
import GuideEdit from "../components/Topic/GuideEdit"
import GuideLinks from "../components/Topic/GuideLinks"
import GuideNotes from "../components/Topic/GuideNotes"
import { useTopic } from "../GlobalContext/topic"
import Mobius from "graphql-mobius"

// TODO: for some reason when you first run `pnpm dev`
// nothing shows
// you have to add a div below and save then things show..

type Link = {
  title: string
  url: string
}

type Section = {
  title: string
  summary: string
  links?: Link[]
}

type Guide = {
  summary: string
  sections: Section[]
}

async function getHankoCookie() {
  const allCookies = document.cookie
  const hankoCookie = allCookies
    .split(";")
    .find((cookie) => {
      return cookie
    })
    ?.split("=")[1]
  return hankoCookie
}

export default function Topic() {
  const topic = useTopic()

  onMount(async () => {
    const hankoCookie = await getHankoCookie()

    const mobius = new Mobius({
      fetch: (query) =>
        fetch("http://127.0.0.1:4000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${hankoCookie}`
          },
          body: JSON.stringify({
            query,
            variables: {},
          }),
        }).then((res) => res.json()),
    })

    const res = await mobius.query({
      getGlobalTopic: {
        topicName: "physics"
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
              <Match when={topic.topic.showPage === "Global Guide"}>
                <Guide />
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
            </Switch>
          </div>
          <div
            id="InfoSidebar"
            class="h-full w-[35%] flex flex-col gap-6 overflow-auto"
            style={{ padding: "24px 40px 24px 0px" }}
          >
            <div class="flex flex-col w-full gap-2 font-light text-[#6B6B70]">
              <div class="flex justify-between">
                <div class="font-semibold">Sections</div>
                <div
                  class="flex items-center gap-1 text-[#3B5CCC] font-light"
                  // onClick={}
                >
                  {/* <Icon name="Plus"></Icon>Add Section */}
                </div>
              </div>

              <For each={topic.topic.guideSections}>
                {(section) => {
                  // TODO: clicking on ection, should jump to that section in focus
                  return <div>{section.title}</div>
                }}
              </For>
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
