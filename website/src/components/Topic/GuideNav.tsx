import { Show, createEffect, createSignal, onMount, untrack } from "solid-js"
import { A, useNavigate } from "solid-start"
import { createShortcut } from "@solid-primitives/keyboard"
import { useUser } from "../../GlobalContext/user"
import Icon from "../Icon"
import { Search, SearchResult, createSearchState } from "../Search"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import { useGlobalState } from "../../GlobalContext/global"
import clsx from "clsx"
import FancyButton from "../FancyButton"

// TODO: add fuzzy searching for topics. also consider lower case inputs matching results too
export default function GuideNav() {
  const [showInput, setShowInput] = createSignal(false)
  const navigate = useNavigate()
  const topic = useGlobalTopic()
  const global = useGlobalState()
  const user = useUser()

  const [topicSearchResults, setTopicSearchResults] = createSignal<string[]>([])
  const [topicSearchInput, setTopicSearchInput] = createSignal("")
  const [focusedTopic, setFocusedTopic] = createSignal(0)
  const [focusedTodoTitle, setFocusedTodoTitle] = createSignal("")
  const [showIcon, setShowIcon] = createSignal("light")

  // TODO: make it into effect so it switches when user changes theme whilst site is loaded
  onMount(() => {
    const darkTheme =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    if (darkTheme) {
      setShowIcon("dark")
    }
  })

  createShortcut(["ARROWDOWN"], () => {
    if (focusedTopic() === topicSearchResults().length - 1) {
      setFocusedTopic(0)
      return
    }
    setFocusedTopic(focusedTopic() + 1)
  })
  createShortcut(["ARROWUP"], () => {
    if (focusedTopic() === 0) {
      setFocusedTopic(topicSearchResults().length - 1)
      return
    }
    setFocusedTopic(focusedTopic() - 1)
  })

  createEffect(() => {
    if (topicSearchInput()) {
      untrack(() => {
        // TODO: breaking.. need custom search component
        // setTopicSearchResults(global.state.globalTopicsSearchList)
        setTopicSearchResults(
          topicSearchResults().filter((word: string) =>
            topicSearchInput()
              .split("")
              .every((value) => {
                return word.split("").includes(value)
              })
          )
        )
      })
      setFocusedTodoTitle(topicSearchResults()[focusedTopic()])
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

  return (
    <>
      <style>
        {`
      #InputMinimised {
        width: 212px;
      }
      #InputExpanded {
        width: 500px;
      }
    #Focused {
      background-color: rgba(124,124,124,0.4);
    }
    #UnFocused {
      background-color: transparent;
    }
    #NavMenu {
      display: block;
    }
    #NavButtons {
      display: none;
    }
    #NavBarSide {
      width: 100%
    }
    @media (min-width: 700px) {
      #NavMenu {
        display: none;
      }
      #NavButtons {
        display: flex;
      }
      #NavBarSide {
        width: 50%
      }
    }
      `}
      </style>
      <div class="flex flex-col dark:bg-[#161616] h-[10%] dark:bg-opacity-80">
        <div class="h-full w-full p-4 gap-4 flex items-center justify-between border-b-[0.5px] border-[#69696951]">
          <div id="NavBarSide" class="flex gap-4 w-1/2 h-full items-center">
            <div class="rounded-full">
              <div
                class="cursor-pointer"
                onClick={() => {
                  navigate("/")
                }}
              >
                {/* add logo only when it looks good and clean. need clean svg */}
                {/* <img class="rounded-full" src="/logo.png" alt="" /> */}
                {/* <Icon name="Home" /> */}
                {/* TODO: does not work for now */}

                <Show
                  when={showIcon() === "light"}
                  fallback={
                    <img src="/logo-white.svg" class="h-[50px] w-[50px]" />
                  }
                >
                  <img src="/logo-black.svg" class="h-[50px] w-[50px]" />
                </Show>
              </div>
            </div>

            <div
              class={clsx(
                "relative w-[50%] h-full flex items-center transition-all duration-150",
                search_state.searchOpen && "w-full"
              )}
            >
              <Search placeholder="Search Topic" state={search_state} />
            </div>
          </div>
          <div id="NavMenu">Burger</div>
          <div id="NavButtons" class="flex items-center justify-center gap-4">
            {/* TODO:  */}
            {/* <div>Dark/Light switch</div> */}
            {/* <div
              class="text-black cursor-pointer font-medium"
              onClick={() => {
                navigate("/about")
              }}
            >
              About
            </div>
            <a
              class="text-black font-medium"
              href="https://github.com/learn-anything/learn-anything.xyz"
            >
              GitHub
            </a>/ */}
            {/* TODO: hide it for non members too */}
            <Show
              when={!user.user.signedIn}
              fallback={
                <A
                  class="cursor-pointer"
                  style={{
                    color: "black"
                  }}
                  href={`${
                    user.user.username ? `/@${user.user.username}` : "/profile"
                  }`}
                >
                  <Icon name="UserProfile" />
                </A>
              }
            >
              <FancyButton onClick={() => navigate("/auth")}>
                Sign In
              </FancyButton>
            </Show>
            {/* <div>Menu</div> */}
          </div>
        </div>
        {/* <Show when={topic.topic.path}>
          <div class="flex items-center font-light text-[14px] px-2 h-[30px] w-full bg-[#f5f5f5] text-[#696969]">
            {topic.topic.path}
          </div>
        </Show> */}
      </div>
    </>
  )
}
