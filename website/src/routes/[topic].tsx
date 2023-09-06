import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  untrack,
} from "solid-js"
import GuideSummary from "../components/Topic/GuideSummary"
import TitlePill from "../components/Topic/TitlePill"
import TopicNav from "../components/Topic/TopicNav"
import Guide from "../components/Topic/Guide"
import Card from "../components/Topic/Card"
import GuideEdit from "../components/Topic/GuideEdit"
import Icon from "../components/Icon"
import { div } from "edgedb/dist/primitives/bigint"
import GuideLinks from "../components/Topic/GuideLinks"
import GuideNotes from "../components/Topic/GuideNotes"

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

export default function Topic() {
  const [currentTab, setCurrentTab] = createSignal("Guide")
  const [topics, setTopics] = createSignal<Guide>({
    summary:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam rem est deleniti repudiandae voluptatum explicabo autem libero alias eveniet nobis at doloribus nulla, ullam magnam, fuga incidunt. Dignissimos, repudiandae distinctio",
    sections: [
      {
        title: "Introduction to cooking pasta",
        summary:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam rem est deleniti repudiandae voluptatum explicabo autem libero alias eveniet nobis at doloribus nulla, ullam magnam, fuga incidunt. Dignissimos, repudiandae distinctio",
        links: [
          {
            title: "verb",
            url: "x.com",
          },
          {
            title: "verb",
            url: "x.com",
          },
          {
            title: "verb",
            url: "x.com",
          },
        ],
      },
      {
        title: "Intermediate cooking pasta with tomato sauce",
        summary:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam rem est deleniti repudiandae voluptatum explicabo autem libero alias eveniet nobis at doloribus nulla, ullam magnam, fuga incidunt. Dignissimos, repudiandae distinctio",
        links: [
          {
            title: "verb",
            url: "x.com",
          },
          {
            title: "verb",
            url: "x.com",
          },
          {
            title: "verb",
            url: "x.com",
          },
        ],
      },
      {
        title: "End cooking pasta the italian way",
        summary:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam rem est deleniti repudiandae voluptatum explicabo autem libero alias eveniet nobis at doloribus nulla, ullam magnam, fuga incidunt. Dignissimos, repudiandae distinctio",
        links: [
          {
            title: "verb",
            url: "x.com",
          },
          {
            title: "verb",
            url: "x.com",
          },
          {
            title: "verb",
            url: "x.com",
          },
        ],
      },
    ],
  })
  // const [notes, setNotes] = createSignal([{}])
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
          display: block;
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
              setCurrentTab("Guide")
            }}
            class="border-b-2 border-black"
          >
            Guide
          </div>
          <div
            onClick={() => {
              setCurrentTab("Links")
            }}
          >
            Links
          </div>
          <div
            onClick={() => {
              setCurrentTab("Notes")
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
              <Match when={currentTab() === "Guide"}>
                <Guide setCurrentTab={setCurrentTab} />
              </Match>
              <Match when={currentTab() === "Links"}>
                <GuideLinks />
              </Match>
              <Match when={currentTab() === "Notes"}>
                <GuideNotes />
              </Match>
              <Match when={currentTab() === "EditGuide"}>
                <GuideEdit topics={topics()} />
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
                  <Icon name="Plus"></Icon>Add Section
                </div>
              </div>

              <For each={topics().sections}>
                {(section) => {
                  return <div>{section.title}</div>
                }}
              </For>
              {/* <Show></Show> */}
            </div>
            <div id="Cards" class="flex flex-col gap-2">
              <Card name="Interactive Graph" />
              <Card name="Learners" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
