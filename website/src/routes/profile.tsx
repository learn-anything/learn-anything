import { useNavigate } from "solid-start"
import { useUser } from "../GlobalContext/user"
import { Match, Switch, createSignal, onMount } from "solid-js"
import TopicNav from "../components/Topic/TopicNav"
import clsx from "clsx"
import Icon from "../components/Icon"
import { Search, createSearchState } from "../components/Search"

export default function Profile() {
  const user = useUser()
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = createSignal("All")

  onMount(() => {
    if (!user.user.signedIn) {
      navigate("/auth")
    }
  })
  const searchResults: SearchResult[] = [
    { name: "Physics" },
    { name: "Math" },
    { name: "Karabiner" }
  ]
  const search_state = createSearchState({
    searchResults: () => searchResults,
    onSelect: console.log
  })

  // TODO: add ability to choose username (as member only)
  // see a list of all links/topics you've added etc.
  // essentially your user profile
  // just need to become member to claim the username too
  // members should be able to change username too, to something that's available if they want
  return (
    <>
      <style>{`
    #ProfileSuggest {
      display: none;
    }
    #ProfileInfo {
      width: 100%;
    }

    #ProfileMain {
      flex-direction: column;
    }
    #ProfileSidebar {
      width: 100%;
      height: fit-content;
    }

  @media (min-width: 700px) {
    #ProfileMain {
     flex-direction: row;
    }
    #ProfileSuggest {
      display: flex;
    }
    #ProfileMain {
      width: 100%;
    }
    #ProfileSidebar {
      width: 30%;
      height: 100vh;
    }

  }
  `}</style>
      <div class="w-screen h-full text-black bg-white dark:bg-neutral-900 dark:text-white">
        <TopicNav />

        <div id="ProfileMain" class="h-full w-full flex justify-center">
          <div
            id="ProfileInfo"
            class="h-full min-h-screen flex gap-6 flex-col p-[40px]"
          >
            <Search placeholder="Search Topic" state={search_state} />
            <div class="w-full flex text-[#696969] text-[14px] justify-between">
              <div
                class={clsx(
                  "p-2 cursor-pointer",
                  currentTab() === "All" &&
                    "border-b border-black text-black font-bold"
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
                    "border-b border-black text-black font-bold"
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
                    "border-b border-black text-black font-bold"
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
                    "border-b border-black text-black font-bold"
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
            id="ProfileSidebar"
            class="p-[20px] py-[24px] min-w-[250px] h-screen w-[30%] flex flex-col gap-6 overflow-auto bg-[#F6F6F7] dark:bg-neutral-900"
          >
            <div class="flex justify-between items-center">
              <div class="font-bold gap-2 flex items-center">
                <div class="h-[35px] w-[35px] bg-neutral-300 rounded-full"></div>
                <div>Name</div>
              </div>
              <div class="border-[#CCCCCC] border rounded-[4px] text-[14px] px-2 text-[#696969] p-0.5">
                Edit
              </div>
            </div>
            <div class=" text-[#6B6B70] text-[14px] font-light">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque
              ipsum aspernatur numquam quis quam ducimus illo tenetur veritatis
            </div>
            <div class="text-[#3B5CCC] font-light text-[14px]">Link</div>
            <div class="text-[#6B6B70] font-light text-[14px]">
              Joined August 2023
            </div>
            <div class="flex justify-between w-full">
              <div class="font-light text-[#6B6B70]">
                <span class="font-bold ">220</span> followers
              </div>
              <div class="text-[#6B6B70] font-light">
                <span class="font-bold">100</span> following
              </div>
            </div>
            <div class="flex flex-col gap-2 w-full">
              <div>Community Karma</div>
              <div class="w-full rounded-[4px] font-light border-[0.5px] text-[#6B6B70]  flex justify-between items-center px-4 p-3 text-[14px] dark:border-[#282828] border-[#69696951]">
                <div class="font-bold flex gap-1 items-center text-[14px]">
                  <Icon name="Heart"></Icon>
                  <div>20</div>
                </div>
                <div>Likes</div>
              </div>
              <div class="w-full rounded-[4px] font-light border-[0.5px] text-[#6B6B70]  flex justify-between items-center px-4 p-3 text-[14px] dark:border-[#282828] border-[#69696951]">
                <div class="font-bold flex gap-1 items-center text-[14px]">
                  <Icon name="Heart"></Icon>
                  <div>25043</div>
                </div>
                <div>Notes</div>
              </div>
              <div class="w-full rounded-[4px] font-light border-[0.5px] text-[#6B6B70]  flex justify-between items-center px-4 p-3 text-[14px] dark:border-[#282828] border-[#69696951]">
                <div class="font-bold flex gap-1 items-center text-[14px]">
                  <Icon name="Heart"></Icon>
                  <div>10000</div>
                </div>
                <div>Likes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
