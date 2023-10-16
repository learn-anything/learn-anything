import GlobalGuide from "../../components/Topic/GlobalGuide"
// @ts-ignore
import { Motion } from "@motionone/solid"
import GuideSidebar from "../../components/Topic/GuideSidebar"
import { useGlobalState } from "../../GlobalContext/global"
import { Match, Show, Switch, createEffect, createSignal } from "solid-js"
import GuideLinks from "../../components/Topic/GuideLinks"
import GuideNav from "../../components/Topic/GuideNav"
import clsx from "clsx"
import FancyButton from "../../components/FancyButton"
import { useUser } from "../../GlobalContext/user"
import { useNavigate } from "solid-start"

export default function GlobalTopic() {
  const global = useGlobalState()
  const [blurWidth, setBlurWidth] = createSignal()
  const user = useUser()
  const navigate = useNavigate()

  createEffect(() => {
    setTimeout(() => {
      const infoMain = document.getElementById("InfoMain")
      setBlurWidth(infoMain?.scrollHeight / 2)
      window.addEventListener("resize", function () {
        // console.log("The window has been resized!")
        setBlurWidth(infoMain?.scrollHeight / 2)
      })
    }, 1000)
  })

  return (
    <>
      <style>{`
        #InfoSidebar {
          display: none;
        }

        #InfoMain::-webkit-scrollbar {
          display: none;
        }
        #InfoOptions {
          display: none;
        }
      @media (min-width: 700px) {
        #InfoSidebar {
          display: flex;
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

        <div class="h-[90%] w-full flex">
          <div
            id="InfoMain"
            class={clsx(
              " w-full bg-white h-full relative overflow-auto dark:bg-[#1C1C1C] flex gap-6 flex-col",
              true && ""
            )}
            style={{ padding: "24px 20px 24px 20px" }}
          >
            <Switch>
              <Match when={global.state.guidePage === "Guide"}>
                <GlobalGuide />
              </Match>
              <Match when={global.state.guidePage === "Links"}>
                <GuideLinks />
              </Match>
            </Switch>

            {/* <Show when={true && blurWidth()}> */}
            <Show when={!user.user.member && blurWidth()}>
              <div
                class="absolute flex flex-col right-0 z-50 w-full"
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
                        <FancyButton
                          onClick={() => {
                            navigate("/pricing")
                          }}
                        >
                          Become member
                        </FancyButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Show>
          </div>

          <Motion.div
            id="InfoSidebar"
            class="  dark:bg-[#161616] bg-[#F4F4F6] border-l-[0.5px] border-[#69696951] h-full min-w-[250px]"
          >
            <GuideSidebar></GuideSidebar>
          </Motion.div>
          {/* TODO: only here because commenting below block failed.. */}
          {/* add this when we have the data from server for who is learning the topic..  */}
        </div>
      </div>
    </>
  )
}
