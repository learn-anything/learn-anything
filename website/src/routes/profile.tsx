import { ui } from "@la/shared"
import { autofocus } from "@solid-primitives/autofocus"
import * as scheduled from "@solid-primitives/scheduled"
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
import { A, useNavigate } from "solid-start"
import toast, { Toaster } from "solid-toast"
import { useGlobalState } from "../GlobalContext/global"
import { useUser } from "../GlobalContext/user"
import GlobalGuideLink from "../components/Topic/GlobalGuideLink"
import GuideNav from "../components/Topic/GuideNav"
import { useMobius } from "../root"
import { IconButton } from "@la/shared/ui"
import { parseResponse } from "@la/shared/lib"

type NewLink = {
  url: string
  title: string
  // description: string
  // mainTopic: string
  linkState: "Bookmark" | "InProgress" | "Completed" | "None"
  liked: boolean
}

const isUrlValid = (url: string) => {
  try {
    new URL(url)
    return true
  } catch (_) {
    return false
  }
}

const NewLinkModal = (props: {
  onClose: () => void
  onSubmit: (newLink: NewLink) => Promise<[done: any, error: any]>
}) => {
  const mobius = useMobius()
  const [title, setTitle] = createSignal("")
  const [url, setUrl] = createSignal("")
  const [description, setDescription] = createSignal("")
  const [mainTopic, setMainTopic] = createSignal("")
  const [linkState, setLinkState] = createSignal<
    "Bookmark" | "InProgress" | "Completed" | "None"
  >("Bookmark")
  const [liked, setLiked] = createSignal(false)

  const updateProposedTitle = async (url_value: string) => {
    if (!isUrlValid(url_value)) return

    const res = await mobius.query({
      checkUrl: {
        where: { linkUrl: url_value },
        select: true
      }
    })
    // @ts-ignore
    const new_title = res?.data?.checkUrl as string | undefined
    if (new_title) {
      setTitle(new_title)
    }
  }

  const scheduledFetchProposedTitle = scheduled.throttle(
    updateProposedTitle,
    1000
  )

  const updateUrl = (new_url: string) => {
    setUrl(new_url)
    if (new_url) {
      scheduledFetchProposedTitle(new_url)
    } else {
      setTitle("")
    }
  }

  const submit = async () => {
    if (!url()) {
      toast("Need to enter URL to save")
      return
    }
    if (!title()) {
      toast("Need to enter title to save")
      return
    }
    // if (!mainTopic()) {
    //   toast("Need to enter main topic to save")
    //   return
    // }
    if (!isUrlValid(url())) {
      toast("Invalid URL")
      return
    }

    const newLink: NewLink = {
      url: url(),
      title: title(),
      // description: description(),
      // mainTopic: mainTopic(),
      linkState: linkState(),
      liked: liked()
    }

    const [done, err] = await props.onSubmit(newLink)
    if (done) {
      props.onClose()
    } else {
      toast(JSON.stringify(err))
    }
  }

  return (
    <ui.Modal onClose={props.onClose}>
      <div class="w-3/4 border-light dark:border-dark relative z-50 h-1/2 rounded-lg dark:border-opacity-50 bg-white border-default dark:bg-neutral-900 flex-col justify-between gap-1 p-[20px] px-[24px]">
        <div class="flex-col">
          <input
            type="text"
            ref={(el) => autofocus(el)}
            autofocus
            placeholder="URL"
            onInput={(e) => {
              const str = e.target.value
              updateUrl(str)
            }}
            onPaste={(e) => {
              const str = (e.target as HTMLInputElement).value // TODO: make issue to solid
              updateUrl(str)
            }}
            class="bg-inherit text-[26px] outline-none w-full px-2 font-bold tracking-wide opacity-50 hover:opacity-70 focus:opacity-100  transition-all rounded-[4px] p-1 "
          />
          <input
            type="text"
            placeholder="Title"
            value={title()}
            onInput={(e) => {
              const str = e.target.value
              setTitle(str)
            }}
            onPaste={(e) => {
              const str = (e.target as HTMLInputElement).value // TODO: make issue to solid
              setTitle(str)
            }}
            class="bg-inherit pb-3 text-[20px] outline-none w-full px-2 font-bold tracking-wide opacity-50 hover:opacity-70 focus:opacity-100  transition-all rounded-[8px] p-1"
          />
          {/* <input
            type="text"
            placeholder="Description"
            value={description()}
            onInput={(e) => {
              const str = e.target.value
              setDescription(str)
            }}
            onPaste={(e) => {
              const str = (e.target as HTMLInputElement).value // TODO: make issue to solid
              setDescription(str)
            }}
            class="bg-inherit text-[20px] px-2 outline-none w-full font-bold tracking-wide opacity-50 hover:opacity-70 focus:opacity-100  transition-all rounded-[8px] p-1 mb-4"
          /> */}
          {/* TODO: add suggestions but allow custom input for topic (can be any topic) */}
          {/* <input
            type="text"
            placeholder="Main Topic"
            value={mainTopic()}
            onInput={(e) => {
              const str = e.target.value
              setMainTopic(str)
            }}
            onPaste={(e) => {
              const str = (e.target as HTMLInputElement).value // TODO: make issue to solid
              setMainTopic(str)
            }}
            class="bg-inherit text-[20px] px-2 outline-none w-full font-bold tracking-wide opacity-50 hover:opacity-70 focus:opacity-100  transition-all rounded-[8px] p-1"
          /> */}
        </div>
        <div class="flex justify-between flex-row-reverse w-full">
          <div class="flex gap-2 items-center">
            <IconButton
              onClick={() => {
                if (linkState() === "Bookmark") {
                  setLinkState("None")
                } else {
                  setLinkState("Bookmark")
                }
              }}
              icon="Bookmark"
              activeIcon={linkState() === "Bookmark"}
            />
            <IconButton
              onClick={() => {
                if (linkState() === "InProgress") {
                  setLinkState("None")
                } else {
                  setLinkState("InProgress")
                }
              }}
              icon="In Progress"
              activeIcon={linkState() === "InProgress"}
            />
            <IconButton
              onClick={() => {
                if (linkState() === "Completed") {
                  setLinkState("None")
                } else {
                  setLinkState("Completed")
                }
              }}
              icon="Completed"
              activeIcon={linkState() === "Completed"}
            />
            {/* TODO: add back */}
            {/* <IconButton
              onClick={() => {
                if (liked()) {
                  setLiked(false)
                } else {
                  setLiked(true)
                }
              }}
              icon="Liked"
              activeIcon={liked()}
            /> */}
            <div
              onClick={submit}
              class="dark:bg-white bg-gray-200 px-[42px] hover:bg-opacity-90 transition-all p-2 text-black rounded-[8px] cursor-pointer"
            >
              Save
            </div>
          </div>
          <div
            class=" px-4 border-light dark:border-dark p-2 rounded-[8px] cursor-pointer"
            onClick={() => {
              props.onClose()
            }}
          >
            Cancel
          </div>
        </div>
      </div>
    </ui.Modal>
  )
}

export default function Profile() {
  const user = useUser()
  const mobius = useMobius()
  const global = useGlobalState()
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = createSignal("Links")
  const [showAddLinkModal, setShowAddLinkModal] = createSignal(false)
  const [showHelpModal, setShowHelpModal] = createSignal(false)
  const [showFilter, setShowFilter] = createSignal(false)
  const [linkFilter, setLinkFilter] = createSignal("")

  const submitNewLink = async (newLink: NewLink) => {
    const res = await mobius.mutate({
      addPersonalLink: {
        where: {
          url: newLink.url,
          title: newLink.title,
          // description: newLink.description,
          // mainTopic: newLink.mainTopic,
          linkState: newLink.linkState,
          liked: newLink.liked
        },
        select: true
      }
    })
    const [data, err] = parseResponse(res)
    if (data) {
      switch (newLink.linkState) {
        case "Bookmark":
          user.set("linksBookmarked", [
            ...(user.user.linksBookmarked || []),
            {
              id: "1",
              title: null,
              description: null,
              mainTopic: null,
              globalLink: {
                id: "",
                title: newLink.title,
                description: "",
                url: newLink.url,
                year: null
              }
            }
          ])
          break
        case "InProgress":
          user.set("linksInProgress", [
            ...(user.user.linksInProgress || []),
            {
              id: "1",
              title: null,
              description: null,
              mainTopic: null,
              globalLink: {
                id: "",
                title: newLink.title,
                description: "",
                url: newLink.url,
                year: null
              }
            }
          ])
          break
        case "Completed":
          user.set("linksCompleted", [
            ...(user.user.linksCompleted || []),
            {
              id: "1",
              title: null,
              description: null,
              mainTopic: null,
              globalLink: {
                id: "",
                title: newLink.title,
                description: "",
                url: newLink.url,
                year: null
              }
            }
          ])
          break
        default:
          break
      }
      return [true, null]
    } else {
      return [false, err]
    }
  }

  onMount(() => {
    if (!user.user.signedIn) {
      navigate("/auth")
    }
  })

  createEffect(() => {
    console.log(user.user, "user")
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
          class="fixed hover:scale-[1.1] active:scale-[0.8] transition-all bottom-3 right-3 text-white bg-blue-600 px-4 p-2 rounded-full cursor-pointer"
        >
          Add Link
        </div>
        <Show when={showAddLinkModal()}>
          <NewLinkModal
            onClose={() => setShowAddLinkModal(false)}
            onSubmit={submitNewLink}
          />
        </Show>
        <div
          onClick={() => {
            setShowHelpModal(true)
          }}
          class="fixed hover:scale-[1.1] active:scale-[0.8] bottom-3 left-3  transition-all border-slate-400 border px-4 p-2 rounded-full cursor-pointer"
        >
          ?
        </div>
        <Show when={showHelpModal()}>
          {/* @ts-ignore */}
          <ui.Modal onClose={setShowHelpModal}>
            <div class="w-1/2 relative z-50 h-fit overflow-auto rounded-lg bg-white border-light dark:border-dark dark:bg-neutral-900 col-gap-[16px] p-[20px] px-[24px]">
              <div>
                This page is being improved rapidly. If you hit any issues, ask
                on <a href="https://discord.com/invite/bxtD8x6aNF">Discord</a>.
              </div>
              <div>
                For now you can see 1,100+ topics available with guides.
              </div>
              <div>You can also mark any of the guides learning status.</div>
              <div>
                You can also even mark any of not available topics learning
                status. For example by going to
                `learn-anything.xyz/transformer-neural-networks`. It does not
                yet have a guide but you can still mark it as learning.
              </div>
              <div>
                Work is being done already on the desktop app. To same level of
                quality as Obsidian/Reflect. If you want to test it, join{" "}
                <a href="https://discord.com/invite/bxtD8x6aNF">Discord</a>. All
                the{" "}
                <a href="https://discord.com/invite/bxtD8x6aNF">code is open</a>
                , if you are developer, you are welcome to tune the tool to your
                liking. We will help you with that.
              </div>
              <div>
                Work is also being done on making your markdown or any other
                kinds of notes publishing to the web. Vectorising it all and
                providing AI search interface to it. Together with API. And lots
                more.
              </div>
              <div>
                If you don't like something and are thinking of stopping being a
                member, it would be lovely to{" "}
                <a href="https://cal.com/nikiv/15min">
                  talk with you in person
                </a>{" "}
                or on{" "}
                <a href="https://discord.com/invite/bxtD8x6aNF">Discord</a>.
              </div>
              <div>
                We want to make this tool work exactly how you want it. You can
                always <A href="/pricing">unsubscribe without a call</A> too. 😿
              </div>
              <div class="w-full">
                <ui.FancyButton
                  onClick={() => {
                    window.open("https://discord.com/invite/bxtD8x6aNF")
                  }}
                >
                  Join Discord to get help and beta test out features
                </ui.FancyButton>
              </div>
            </div>
          </ui.Modal>
        </Show>
        <div id="ProfileMain" class="h-full w-full flex justify-center">
          <div id="ProfileInfo" class="h-full flex gap-6 flex-col p-[40px]">
            {/* {(() => {
              const search_state = ui.createSearchState({
                searchResults: user.likedLinksSearch,
                onSelect({ name }) {
                  // let foundLink = user.user.likedLinks.find(
                  //   (l) => l.title === name
                  // )
                  // if (!foundLink) {
                  //   foundLink = user.user.personalLinks.find(
                  //     (l) => l.title === name
                  //   )
                  // }
                  // TODO: temp hack, get protocol with all the links and use that (https should work often though for now)
                  // window.location.href = `https://${foundLink?.url}`
                }
              })
              return (
                <ui.Search
                  placeholder={"Search liked and added links"}
                  state={search_state}
                />
              )
            })()} */}
            <div class="flex justify-between items-center text-[#696969] ">
              <div class="w-full flex text-[#696969] text-[14px] gap-4">
                <div
                  id="Learning"
                  class={clsx(
                    "p-2 cursor-pointer transition-all ",
                    currentTab() === "Learning" &&
                      " border-black border-b  text-black dark:text-white dark:border-white font-bold"
                  )}
                  onClick={() => {
                    setCurrentTab("Learning")
                  }}
                >
                  Learning
                </div>
                <div
                  id="ToLearn"
                  class={clsx(
                    "p-2 cursor-pointer  transition-all ",
                    currentTab() === "ToLearn" &&
                      " border-black border-b  text-black dark:text-white dark:border-white font-bold"
                  )}
                  onClick={() => {
                    setCurrentTab("ToLearn")
                  }}
                >
                  To Learn
                </div>
                <div
                  id="Learned"
                  class={clsx(
                    "p-2 cursor-pointer transition-all ",
                    currentTab() === "Learned" &&
                      " border-black border-b  text-black dark:text-white dark:border-white font-bold"
                  )}
                  onClick={() => {
                    setCurrentTab("Learned")
                  }}
                >
                  Learned
                </div>
                <div
                  id="Links"
                  class={clsx(
                    "p-2 cursor-pointer  transition-all ",
                    currentTab() === "Links" &&
                      " border-black border-b text-black dark:text-white dark:border-white font-bold"
                  )}
                  onClick={() => {
                    setCurrentTab("Links")
                  }}
                >
                  Links
                </div>
              </div>
              <Show when={currentTab() === "Links"}>
                <div class="relative">
                  <Show when={showFilter()}>
                    <div class="dark:bg-[#161616] bg-white absolute top-[120%] flex flex-col gap-1 p-1 rounded-[4px] border-[0.5px] dark:border-[#282828]  border-[#69696951] right-[0%] cursor-pointer">
                      <div
                        onClick={() => {
                          toast("Coming soon ♥️")
                          return
                          if (linkFilter() === "liked") {
                            setLinkFilter("")
                          } else {
                            setLinkFilter("liked")
                          }
                          setShowFilter(false)
                        }}
                        class="hover:bg-neutral-800 w-full rounded-[4px] px-4 p-2"
                      >
                        Liked
                      </div>
                      <div
                        onClick={() => {
                          toast("Coming soon ♥️")
                          return
                          if (linkFilter() === "completed") {
                            setLinkFilter("")
                          } else {
                            setLinkFilter("completed")
                          }
                          setShowFilter(false)
                        }}
                        class="hover:bg-neutral-800 w-full rounded-[4px] px-4 p-2 cursor-pointer"
                      >
                        Completed
                      </div>
                      <div
                        onClick={() => {
                          toast("Coming soon ♥️")
                          return
                          if (linkFilter() === "personal") {
                            setLinkFilter("")
                          } else {
                            setLinkFilter("personal")
                          }
                          setShowFilter(false)
                        }}
                        class="hover:bg-neutral-800 w-full rounded-[4px] px-4 p-2 cursor-pointer"
                      >
                        Personal
                      </div>
                    </div>
                  </Show>
                  <div
                    class="cursor-pointer px-2 opacity-50 hover:opacity-100 transition-all"
                    onClick={() => {
                      setShowFilter(!showFilter())
                    }}
                  >
                    <ui.Icon
                      name="Filter"
                      border={
                        global.state.theme === "light" ? "black" : "white"
                      }
                    ></ui.Icon>
                  </div>
                </div>
              </Show>
            </div>
            <Switch>
              <Match when={currentTab() === "ToLearn"}>
                <div class="flex gap-3 flex-col">
                  <For each={user.user.topicsToLearn}>
                    {(topic) => {
                      console.log(user.user.topicsToLearn, "topics to learn")
                      console.log(topic, "topic")
                      return (
                        <>
                          <div class="flex items-center overflow-hidden rounded-[4px]  border-[0.5px] dark:border-[#282828]  border-[#69696951] p-4 px-4 justify-between">
                            <div class="w-full  h-full flex justify-between items-center">
                              <div class="w-fit flex gap-1 flex-col">
                                <div class="flex gap-3 items-center">
                                  <Show when={topic.verified}>
                                    <ui.Icon name="Verified" />
                                  </Show>
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
              <Match when={currentTab() === "Links"}>
                <div class="flex gap-3 flex-col">
                  <For each={user.user.linksInProgress}>
                    {(link) => {
                      return (
                        <div class="[&>*]:border-none border rounded-[4px] dark:border-[#282828]  border-[#69696951]">
                          <GlobalGuideLink
                            personalLinkId={link.id}
                            title={
                              link.title ? link.title : link.globalLink.title
                            }
                            url={link.globalLink.url}
                            id={link.globalLink.id}
                            year={link.globalLink.year}
                            protocol={"https"}
                            description={
                              link.description
                                ? link.description
                                : link.globalLink.description
                            }
                          />
                        </div>
                      )
                    }}
                  </For>
                  <For each={user.user.linksBookmarked}>
                    {(link) => {
                      return (
                        <div class="[&>*]:border-none border rounded-[4px] dark:border-[#282828]  border-[#69696951]">
                          <GlobalGuideLink
                            personalLinkId={link.id}
                            title={
                              link.title ? link.title : link.globalLink.title
                            }
                            url={link.globalLink.url}
                            id={link.globalLink.id}
                            year={link.globalLink.year}
                            protocol={"https"}
                            description={
                              link.description
                                ? link.description
                                : link.globalLink.description
                            }
                          />
                        </div>
                      )
                    }}
                  </For>
                  <For each={user.user.linksCompleted}>
                    {(link) => {
                      return (
                        <div class="[&>*]:border-none border rounded-[4px] dark:border-[#282828]  border-[#69696951]">
                          <GlobalGuideLink
                            personalLinkId={link.id}
                            title={
                              link.title ? link.title : link.globalLink.title
                            }
                            url={link.globalLink.url}
                            id={link.globalLink.id}
                            year={link.globalLink.year}
                            protocol={"https"}
                            description={
                              link.description
                                ? link.description
                                : link.globalLink.description
                            }
                          />
                        </div>
                      )
                    }}
                  </For>
                  <For each={user.linksLikedOnly()}>
                    {(link) => {
                      return (
                        <div class="[&>*]:border-none border rounded-[4px] dark:border-[#282828]  border-[#69696951]">
                          <GlobalGuideLink
                            personalLinkId={link.id}
                            title={
                              link.title ? link.title : link.globalLink.title
                            }
                            url={link.globalLink.url}
                            id={link.globalLink.id}
                            year={link.globalLink.year}
                            protocol={"https"}
                            description={
                              link.description
                                ? link.description
                                : link.globalLink.description
                            }
                          />
                        </div>
                      )
                    }}
                  </For>
                </div>
              </Match>
              <Match when={currentTab() === "Learning"}>
                <div class="flex gap-3 flex-col">
                  <For each={user.user.topicsLearning}>
                    {(topic) => {
                      return (
                        <>
                          <div class="flex items-center overflow-hidden rounded-[4px]  border-[0.5px] dark:border-[#282828]  border-[#69696951] p-4 px-4 justify-between">
                            <div class="w-full  h-full flex justify-between items-center">
                              <div class="w-fit flex gap-1 flex-col">
                                <div class="flex gap-3 items-center">
                                  <Show when={topic.verified}>
                                    <ui.Icon name="Verified" />
                                  </Show>
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
                <div class="flex gap-3 flex-col">
                  {" "}
                  <For each={user.user.topicsLearned}>
                    {(topic) => {
                      return (
                        <>
                          <div class="flex items-center overflow-hidden rounded-[4px]  border-[0.5px] dark:border-[#282828]  border-[#69696951] p-4 px-4 justify-between">
                            <div class="w-full  h-full flex justify-between items-center">
                              <div class="w-fit flex gap-1 flex-col">
                                <div class="flex gap-3 items-center">
                                  <Show when={topic.verified}>
                                    <ui.Icon name="Verified" />
                                  </Show>
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
        <Toaster />
      </div>
    </>
  )
}
