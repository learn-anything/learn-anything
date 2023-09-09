import { For, Match, Show, Switch, createSignal } from "solid-js"
import TopicNav from "../../components/Topic/TopicNav"
import TitlePill from "../../components/Topic/TitlePill"
import Guide from "../../components/Topic/Guide"
import Card from "../../components/Topic/Card"
import { useTopic } from "../../GlobalContext/topic"
import clsx from "clsx"
import Modal from "../../components/Modal"
// import ProfilePage from "../../components/ProfilePage"

export default function UserProfile() {
  const [currentTab, setCurrentTab] = createSignal("All")
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

        <div class="h-full w-full flex justify-center">
          <div class="p-[40px] h-screen w-[30%] flex flex-col gap-6 overflow-auto bg-[#F6F6F7]">
            <div class="flex justify-between items-center">
              <div class="font-bold gap-2 flex items-center">
                <div class="h-[35px] w-[35px] bg-neutral-300 rounded-full"></div>
                <div>Name</div>
              </div>
              <div class="border-[#CCCCCC] border rounded-[4px] text-[14px] px-2 text-[#696969] p-0.5">
                Edit
              </div>
            </div>
            <div class=" text-[#6B6B70] font-light">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque
              ipsum aspernatur numquam quis quam ducimus illo tenetur veritatis
            </div>
            <div class="text-[#3B5CCC] font-light">Link</div>
            <div class="text-[#6B6B70] font-light">Joined August 2023</div>
            <div class="flex justify-between w-full">
              <div class="font-light text-[#6B6B70]">
                <span class="font-bold ">220</span> followers
              </div>
              <div class="text-[#6B6B70] font-light">
                <span class="font-bold">100</span> following
              </div>
            </div>
            <div>Socials</div>
          </div>
          <div
            id="InfoMain"
            class="h-full min-h-screen flex gap-6 flex-col p-[40px]"
          >
            <div class="w-full bg-[#FAFAFA] rounded-[4px]">
              <input
                type="text"
                class="bg-transparent w-full p-3 outline-none font-light text-[#696969]"
                placeholder="Search Users Topics"
              />
            </div>
            <div class="w-full flex text-[#696969] text-[14px] justify-between">
              <div
                class={clsx(
                  "p-2 cursor-pointer",
                  currentTab() === "All" &&
                    "border-b border-black text-black font-bold",
                )}
                onClick={() => {
                  setCurrentTab("All")
                }}
              >
                ALL
              </div>
              <div
                class={clsx(
                  "p-2 cursor-pointer",
                  currentTab() === "ToLearn" &&
                    "border-b border-black text-black font-bold",
                )}
                onClick={() => {
                  setCurrentTab("ToLearn")
                }}
              >
                To Learn
              </div>
              <div
                class={clsx(
                  "p-2 cursor-pointer",
                  currentTab() === "Learning" &&
                    "border-b border-black text-black font-bold",
                )}
                onClick={() => {
                  setCurrentTab("Learning")
                }}
              >
                Learning
              </div>
              <div
                class={clsx(
                  "p-2 cursor-pointer",
                  currentTab() === "Learned" &&
                    "border-b border-black text-black font-bold",
                )}
                onClick={() => {
                  setCurrentTab("Learned")
                }}
              >
                Learned
              </div>
            </div>
            <Switch>
              <Match when={currentTab() === "All"}>
                <div>All</div>
              </Match>
              <Match when={currentTab() === "ToLearn"}>
                <div>ToLearn</div>
              </Match>
              <Match when={currentTab() === "Learning"}>
                <div>Learning</div>
              </Match>
              <Match when={currentTab() === "Learned"}>
                <div>Learned</div>
              </Match>
            </Switch>
          </div>
          <div
            id="InfoSidebar"
            class="h-full w-[25%] flex flex-col gap-6 overflow-auto"
            style={{ padding: "40px 40px 40px 0px" }}
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
