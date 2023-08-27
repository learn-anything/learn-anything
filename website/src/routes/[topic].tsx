import { createEffect, createSignal, untrack } from "solid-js"
import GuideSummary from "../components/Topic/GuideSummary"
import TitlePill from "../components/Topic/TitlePill"
import TopicNav from "../components/Topic/TopicNav"
import Guide from "../components/Topic/Guide"
import Card from "../components/Topic/Card"

// TODO: for some reason when you first run `pnpm dev`
// nothing shows
// you have to add a div below and save then things show..
export default function Topic() {
  const [links, setLinks] = createSignal([
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
    {
      title: "Learn Physics",
      url: "https://github.com/learn-anything/learn-anything.xyz",
    },
    {
      title: "Learn Physics",
      url: "https://github.com/learn-anything/learn-anything.xyz",
    },
    {
      title: "Learn Physics",
      url: "https://github.com/learn-anything/learn-anything.xyz",
    },
  ])
  // const [notes, setNotes] = createSignal([{}])
  return (
    <>
      <style>{``}</style>
      <div class="w-screen h-full text-black bg-white">
        <TopicNav />
        <div class="w-full" style={{ padding: "24px 24px 0 24px" }}>
          <TitlePill />
        </div>
        <div class="h-fit w-full flex justify-center">
          <div
            class="h-full w-[65%] flex gap-6 flex-col"
            style={{ padding: "24px 40px 24px 40px" }}
          >
            <Guide />
          </div>
          <div
            class="h-full w-[35%] flex flex-col gap-6 overflow-auto"
            style={{ padding: "24px 40px 24px 0px" }}
          >
            <Card name="Interactive Graph" />
            <Card name="Learners" />
            <Card name="Links" links={links()} />
            <Card name="Notes" />
          </div>
        </div>
      </div>
    </>
  )
}
