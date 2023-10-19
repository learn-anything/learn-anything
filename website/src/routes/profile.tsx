import clsx from "clsx"
import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  onMount
} from "solid-js"
import { autofocus } from "@solid-primitives/autofocus"
import { A, useNavigate } from "solid-start"
import { useUser } from "../GlobalContext/user"
import FancyButton from "../components/FancyButton"
import Modal from "../components/Modal"
import { Search, createSearchState } from "../components/Search"
import GuideNav from "../components/Topic/GuideNav"
import { useMobius } from "../root"

type NewLink = {
  url: string
  title: string
  description: string
}

export default function Profile() {
  const user = useUser()
  const mobius = useMobius()
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = createSignal("ToLearn")
  const [showAddLinkModal, setShowAddLinkModal] = createSignal(false)
  const [showHelpModal, setShowHelpModal] = createSignal(false)
  const [newLinkData, setNewLinkData] = createSignal<NewLink>({
    url: "",
    title: "",
    description: ""
  })

  // TODO: add debounce here
  createEffect(async () => {
    if (newLinkData().url) {
      try {
        const url = new URL(newLinkData().url)
        const response = await fetch(
          `https://corsproxy.io/?${encodeURIComponent(url.toString())}`
        )
        const html = await response.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, "text/html")
        // @ts-ignore
        const title = doc.querySelector("title").innerText
        setNewLinkData({
          ...newLinkData(),
          title
        })
      } catch (_) {
        return
      }
    }
  })

  onMount(() => {
    if (!user.user.signedIn) {
      navigate("/auth")
    }
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
      <div class="w-screen  h-full min-h-screen text-black bg-white dark:bg-neutral-900 dark:text-white">
        <GuideNav />
        <div
          onClick={() => {
            setShowAddLinkModal(true)
          }}
          class="fixed active:scale-[1.1] bottom-3 right-3 text-white bg-blue-600 px-4 p-2 rounded-full cursor-pointer"
        >
          Add Link
        </div>
        <Show when={showAddLinkModal()}>
          {/* @ts-ignore */}
          <Modal onClose={setShowAddLinkModal}>
            <div class="w-1/2 relative z-50 h-1/2 rounded-lg dark:border-opacity-50 bg-white border-slate-400 border dark:bg-neutral-900 flex flex-col gap-4 p-[20px] px-[24px]">
              <input
                type="text"
                ref={(el) => autofocus(el)}
                autofocus
                placeholder="URL"
                value={newLinkData().url}
                onInput={(e) => {
                  setNewLinkData({
                    ...newLinkData(),
                    url: e.target.value
                  })
                }}
                class="border-b bg-inherit outline-none hover:border-opacity-70 focus:border-opacity-100 border-slate-400 border-opacity-50 w-1/2"
              />
              <input
                type="text"
                placeholder="Title"
                value={newLinkData().title}
                onInput={(e) => {
                  setNewLinkData({
                    ...newLinkData(),
                    title: e.target.value
                  })
                }}
                class="border-b bg-inherit outline-none hover:border-opacity-70  focus:border-opacity-100 border-slate-400 border-opacity-50 w-1/2"
              />
              <input
                type="text"
                placeholder="Description"
                value={newLinkData().description}
                onInput={(e) => {
                  setNewLinkData({
                    ...newLinkData(),
                    description: e.target.value
                  })
                }}
                class="border-b bg-inherit outline-none hover:border-opacity-70 focus:border-opacity-100 border-slate-400 border-opacity-50 w-1/2"
              />
              <div
                onClick={async () => {
                  const res = await mobius.mutate({
                    addPersonalLink: {
                      where: {
                        title: newLinkData().title,
                        url: newLinkData().url,
                        description: newLinkData().description
                      },
                      select: true
                    }
                  })
                  console.log(res, "res")
                }}
                class="absolute bottom-2 right-2 bg-blue-600 px-6 hover:bg-blue-700 p-2 text-white rounded-[4px] cursor-pointer"
              >
                Save
              </div>
              <div class="absolute bottom-2 left-2  px-4 border border-slate-400 p-2 rounded-[4px] cursor-pointer">
                Cancel
              </div>
            </div>
          </Modal>
        </Show>
        <div
          onClick={() => {
            setShowHelpModal(true)
          }}
          class="fixed active:scale-[1.1] bottom-3 left-3 hover:bg-black hover:border-none hover:text-white transition-all border-slate-400 border px-4 p-2 rounded-full cursor-pointer"
        >
          ?
        </div>
        <Show when={showHelpModal()}>
          {/* @ts-ignore */}
          <Modal onClose={setShowHelpModal}>
            <div class="w-1/2 relative z-50 h-1/2 rounded-lg bg-white border-slate-400 border dark:bg-neutral-900 flex flex-col gap-4 p-[20px] px-[24px]">
              <div>This page is being improved rapidly.</div>
              <div>
                For now you can see the 1,050 topics available with guides
              </div>
              <div>You can also mark any of the guides learning status</div>
              <div>
                You can also even mark any of not available topics learning
                status. For example by going to
                `learn-anything.xyz/transformer-neural-networks`. It does not
                yet have a guide but you can still mark it as learning.
              </div>
              <div>
                Work is being done already on the desktop app. To same level of
                quality as Obsidian/Reflect. If you want to test it, join
                Discord.
              </div>
              <div>
                Work is also being done on making your markdown or any other
                kinds of notes publishing to the web. Vectorising it all and
                providing AI search interface to it.
              </div>
              <div class="w-full">
                <FancyButton
                  onClick={() => {
                    window.open("https://discord.com/invite/bxtD8x6aNF")
                  }}
                >
                  Join Discord to get help and beta test out features
                </FancyButton>
              </div>
            </div>
          </Modal>
        </Show>
        <div id="ProfileMain" class="h-full w-full flex justify-center">
          <div id="ProfileInfo" class="h-full flex gap-6 flex-col p-[40px]">
            {(() => {
              const search_state = createSearchState({
                searchResults: user.likedLinksSearch,
                onSelect({ name }) {
                  const foundLink = user.user.likedLinks.find(
                    (l) => l.title === name
                  )
                  // TODO: temp hack, get protocol with all the links and use that (https should work often though for now)
                  window.location.href = `https://${foundLink?.url}`
                }
              })

              return (
                <Search
                  placeholder={"Search Liked Links"}
                  state={search_state}
                />
              )
            })()}
            <div class="w-full flex text-[#696969] text-[14px] justify-between">
              <div
                class={clsx(
                  "p-2 cursor-pointer",
                  currentTab() === "ToLearn" &&
                    "border-b border-black text-black dark:text-white dark:border-white font-bold"
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
                    "border-b border-black text-black dark:text-white dark:border-white font-bold"
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
                    "border-b border-black text-black dark:text-white dark:border-white font-bold"
                )}
                onClick={() => {
                  setCurrentTab("Learned")
                }}
              >
                Learned
              </div>
            </div>
            <Switch>
              <Match when={currentTab() === "ToLearn"}>
                <div>
                  <For each={user.user.topicsToLearn}>
                    {(topic) => {
                      return (
                        <>
                          <div class="flex items-center overflow-hidden  border-[0.5px] dark:border-[#282828]  border-[#69696951] p-4 px-4 justify-between">
                            <div class="w-full  h-full flex justify-between items-center">
                              <div class="w-fit flex gap-1 flex-col">
                                <div class="flex gap-3 items-center">
                                  <A
                                    class="font-bold text-[#3B5CCC] dark:text-blue-400 cursor-pointer"
                                    href={`/${topic.name}`}
                                  >
                                    {topic.prettyName}
                                  </A>
                                </div>

                                {/* <div class="font-light text-[12px] text-[#696969]">PDF</div> */}
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    }}
                  </For>
                </div>
              </Match>
              <Match when={currentTab() === "Learning"}>
                <div>
                  <For each={user.user.topicsToLearning}>
                    {(topic) => {
                      return (
                        <>
                          <div class="flex items-center overflow-hidden  border-[0.5px] dark:border-[#282828]  border-[#69696951] p-4 px-4 justify-between">
                            <div class="w-full  h-full flex justify-between items-center">
                              <div class="w-fit flex gap-1 flex-col">
                                <div class="flex gap-3 items-center">
                                  <A
                                    class="font-bold text-[#3B5CCC] dark:text-blue-400 cursor-pointer"
                                    href={`/${topic.name}`}
                                  >
                                    {topic.prettyName}
                                  </A>
                                </div>

                                {/* <div class="font-light text-[12px] text-[#696969]">PDF</div> */}
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    }}
                  </For>
                </div>
              </Match>
              <Match when={currentTab() === "Learned"}>
                <div>
                  {" "}
                  <For each={user.user.topicsLearned}>
                    {(topic) => {
                      return (
                        <>
                          <div class="flex items-center overflow-hidden  border-[0.5px] dark:border-[#282828]  border-[#69696951] p-4 px-4 justify-between">
                            <div class="w-full  h-full flex justify-between items-center">
                              <div class="w-fit flex gap-1 flex-col">
                                <div class="flex gap-3 items-center">
                                  <A
                                    class="font-bold text-[#3B5CCC] dark:text-blue-400 cursor-pointer"
                                    href={`/${topic.name}`}
                                  >
                                    {topic.prettyName}
                                  </A>
                                </div>

                                {/* <div class="font-light text-[12px] text-[#696969]">PDF</div> */}
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    }}
                  </For>
                </div>
              </Match>
            </Switch>
          </div>

          {/* <div
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
          </div> */}
        </div>
      </div>
    </>
  )
}
