import { ui } from "@la/shared"
import { Match, Show, Switch, createEffect, createSignal } from "solid-js"
import { useNavigate } from "solid-start"
import { useGlobalState } from "../../GlobalContext/global"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import { useUser } from "../../GlobalContext/user"
import GlobalGuide from "../../components/Topic/GlobalGuide"
import GuideLinks from "../../components/Topic/GuideLinks"
import GuideNav from "../../components/Topic/GuideNav"
import GuideNotes from "../../components/Topic/GuideNotes"
import GuideSidebar from "../../components/Topic/GuideSidebar"

export default function GlobalTopic() {
  const global = useGlobalState()
  const topic = useGlobalTopic()
  const [blurWidth, setBlurWidth] = createSignal()
  const navigate = useNavigate()
  const user = useUser()

  createEffect(() => {
    if (topic.globalTopic?.latestGlobalGuide?.sections) {
      setBlurWidth(0)
      if (global.state.guidePage === "Guide") {
        setTimeout(() => {
          const infoMain = document.getElementById("InfoMain")
          // @ts-ignore
          setBlurWidth(infoMain?.scrollHeight / 2)
          window.addEventListener("resize", function () {
            // @ts-ignore
            setBlurWidth(infoMain?.scrollHeight / 2)
          })
          // console.log(blurWidth(), "width")
        }, 1000)
      } else {
        const infoMain = document.getElementById("InfoMain")

        // @ts-ignore
        setBlurWidth(infoMain?.scrollHeight / 2)
        window.addEventListener("resize", function () {
          // @ts-ignore
          setBlurWidth(infoMain?.scrollHeight / 2)
        })
      }
    }
  })
  createEffect(() => {
    const specificViewportWidth = 800
    function handleResize() {
      if (window.innerWidth <= specificViewportWidth) {
        // Perform actions when the viewport width is less than or equal to the specific width
        global.setShowSidebar(false)

        // Add your code here
      } else {
        // Perform actions when the viewport width is greater than the specific width

        global.setShowSidebar(true)
      }
    }
    window.addEventListener("resize", handleResize)
    handleResize()
  })

  return (
    <>
      <style>{`
        #InfoSidebar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          // animation: 0.4s SidebarSlide forwards ease-in
        }

        // @keyframes SidebarSlide {
        //   0% {
        //     height: 0%;
        //   }
        //   100% {
        //     height: 100%;
        //   }
        // }

        #InfoMain::-webkit-scrollbar {
          display: none;
        }
        #InfoOptions {
          display: none;
        }
      @media (min-width: 700px) {
        #InfoSidebar {
          position: static;
          width: 20%;
          animation: none;
        }

        #InfoOptions {
          display: flex
        }
      }
      #divider {
        background: linear-gradient(180deg, rgba(229,9,121,0) 0%, rgba(229,231,235,0.5) 100%);
          backdrop-filter: blur(4px)
       }
      @media (prefers-color-scheme: dark) {
        #divider {
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%);
        }
      }
      `}</style>
      <div class="w-screen fixed top-0 right-0 h-screen text-black dark:text-white bg-white dark:bg-[#1C1C1C]">
        <GuideNav />
        <Show when={global.showMemberOnlyModal()}>
          <ui.ModalWithMessageAndButton
            message="This is a member only feature"
            buttonText="Become Member"
            buttonAction={() => {
              navigate("/pricing")
            }}
            onClose={() => {
              global.setShowMemberOnlyModal(false)
            }}
          />
        </Show>
        {/* TODO: ugly but need to release */}
        {/* ideally this is a more generalised component without needed extra global state.. */}
        <Show when={global.showMemberOnlyModalWithMessage() !== ""}>
          <ui.ModalWithMessageAndButton
            message={global.showMemberOnlyModalWithMessage()}
            buttonText="Become Member"
            buttonAction={() => {
              navigate("/pricing")
            }}
            onClose={() => {
              global.setShowMemberOnlyModalWithMessage("")
            }}
          />
        </Show>
        <div class="h-[90%] w-full flex relative">
          <Show
            when={topic.globalTopic?.latestGlobalGuide?.sections.length > 0}
            fallback={
              <div class="w-full h-full flex items-center justify-center">
                <Show
                  when={!topic.globalTopic.verifiedTopic}
                  fallback={
                    <ui.Icon
                      name="Loader"
                      width="40"
                      height="40"
                      border={
                        global.state.theme === "light" ? "Black" : "White"
                      }
                    ></ui.Icon>
                  }
                >
                  <div class="w-fit">
                    <Show
                      when={!user.user.member}
                      fallback={
                        <div>
                          You can track learning state of this topic. Soon will
                          be able to edit the guide too.
                        </div>
                      }
                    >
                      <ui.FancyButton
                        onClick={() => {
                          navigate("/pricing")
                        }}
                      >
                        Become member to track learning state and make your own
                        guide for this topic.
                      </ui.FancyButton>
                    </Show>
                  </div>
                </Show>
              </div>
            }
          >
            <div
              id="InfoMain"
              class={
                "w-full bg-white h-full relative overflow-auto dark:bg-[#1C1C1C] flex gap-6 flex-col"
              }
              style={{ padding: "24px 20px 24px 20px" }}
            >
              <Switch>
                <Match when={global.state.guidePage === "Guide"}>
                  <GlobalGuide />
                </Match>
                <Match when={global.state.guidePage === "Links"}>
                  <GuideLinks />
                </Match>
                <Match when={global.state.guidePage === "Notes"}>
                  <GuideNotes />
                </Match>
              </Switch>

              <Show when={!user.user.member && blurWidth()}>
                <div
                  class="absolute flex flex-col right-0 w-full"
                  style={{
                    top: `${blurWidth()}px`,
                    "min-height": `${blurWidth()}px`,
                    height: `${blurWidth()}px`
                  }}
                >
                  <div
                    class="absolute top-[-100px] right-0 w-full bg-opacity-50 h-[100px]"
                    id="divider"
                  ></div>

                  <div class="backdrop-blur-sm dark:bg-opacity-50 bg-opacity-50 bg-gray-200 dark:bg-black w-full h-full">
                    <div class="h-full relative">
                      <div class="sticky top-[50%] translate-y-[50%] z-[60] right-0 w-full flex items-center justify-center">
                        <div class="">
                          <Show when={!global.showMemberOnlyModal()}>
                            <ui.FancyButton
                              onClick={() => {
                                navigate("/pricing")
                              }}
                            >
                              Become member
                            </ui.FancyButton>
                          </Show>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Show>
            </div>
          </Show>

          <Show when={global.state.showSidebar}>
            <div
              id="InfoSidebar"
              class="  dark:bg-[#161616] bg-[#F4F4F6] border-l-[0.5px] overflow-hidden border-[#69696951] h-full min-w-[250px]"
            >
              <GuideSidebar></GuideSidebar>
            </div>
          </Show>
          {/* TODO: only here because commenting below block failed.. */}
          {/* add this when we have the data from server for who is learning the topic..  */}
        </div>
      </div>
    </>
  )
}
