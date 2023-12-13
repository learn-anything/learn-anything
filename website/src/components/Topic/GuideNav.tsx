import clsx from "clsx"
import { Show, createMemo } from "solid-js"
import { A, useLocation, useNavigate } from "solid-start"
import { useGlobalState } from "../../GlobalContext/global"
import { useUser } from "../../GlobalContext/user"
import { logUntracked } from "../../lib/baselime"
import { ui } from "@la/shared"

// TODO: add fuzzy searching for topics. also consider lower case inputs matching results too
export default function GuideNav() {
  const navigate = useNavigate()
  const global = useGlobalState()
  const user = useUser()
  const location = useLocation()

  const searchResults = createMemo(() => {
    return global.state.topicsWithConnections.map((t) => ({
      name: t.prettyName
    }))
  })

  const search_state = ui.createSearchState({
    searchResults,
    onSelect: ({ name }) => {
      const foundTopic = global.state.topicsWithConnections.find(
        (t) => t.prettyName === name
      )!
      navigate(`/${foundTopic.name}`)
      logUntracked("Topic searched", search_state.query)
    }
  })

  return (
    <>
      <div class="flex-col dark:bg-[#161616] h-[10%] dark:bg-opacity-80">
        <div class="h-full w-full p-4 gap-4 flex-between border-b-[0.5px] border-[#69696951]">
          <div class="flex sm:w-1/2 w-full gap-4 h-full items-center">
            <div class="rounded-full">
              <div
                class="cursor-pointer min-w-[50px]"
                onClick={() => {
                  navigate("/")
                }}
              >
                <Show
                  when={global.state.theme === "light"}
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
                "relative w-[50%] flex-center transition-all duration-150",
                search_state.searchOpen && "w-full"
              )}
            >
              <ui.Search placeholder="Search Topic" state={search_state} />
            </div>
          </div>
          <div
            class="sm:hidden block"
            onClick={() => {
              global.setShowSidebar(!global.state.showSidebar)
            }}
          >
            {/* <Icon name="Menu" /> */}
            <ui.Icon name="Menu" />
          </div>
          <div class="flex-center  gap-4">
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
            <Show when={user.user.signedIn && location.pathname !== "/profile"}>
              <A
                class="cursor-pointer hover:button-hover p-2 text-black dark:text-white"
                href={`${
                  user.user.username ? `/@${user.user.username}` : "/profile"
                }`}
              >
                <ui.Icon name="UserProfile" />
              </A>
            </Show>
            <Show when={!user.user.signedIn}>
              <ui.FancyButton onClick={() => navigate("/auth")}>
                Sign In
              </ui.FancyButton>
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
