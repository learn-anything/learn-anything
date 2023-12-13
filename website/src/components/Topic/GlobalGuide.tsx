import clsx from "clsx"
import { For, Show, createSignal } from "solid-js"
import { useLocation, useNavigate } from "solid-start"
import { useGlobalState } from "../../GlobalContext/global"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import { useUser } from "../../GlobalContext/user"
import { ui } from "@la/shared"
import GuideSection from "./GuideSection"
import GuideSummary from "./GuideSummary"

export default function GlobalGuide() {
  const navigate = useNavigate()
  const topic = useGlobalTopic()
  const user = useUser()
  const global = useGlobalState()
  const location = useLocation()
  const [showHelpModal, setShowHelpModal] = createSignal(false)

  return (
    <>
      <Show when={showHelpModal()}>
        {/* @ts-ignore */}
        <ui.Modal onClose={setShowHelpModal}>
          <div class="w-[500px] h-[320px] relative z-50 rounded-lg bg-white border-slate-400 border dark:bg-neutral-900 flex flex-col gap-4 p-[20px] px-[24px]">
            <div>This page is being improved rapidly.</div>
            <div>
              Specifically AI description needs some tuning so work is being
              done there.
            </div>
            <div>
              Soon it will show not only a good overview of the topic but will
              also be personalised to each user.
            </div>
            <div>
              Check the profile page in top right corner to keep track of
              links/topics you are learning or have completed.
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
      <div class="w-full flex flex-col gap-[20px] relative">
        <div
          id="Guide"
          class="font-bold  flex w-full items-center justify-between"
        >
          <div class="flex gap-2 items-center cursor-pointer">
            <div class="text-[22px]">{topic.globalTopic.prettyName}</div>
            <div
              onClick={() => {
                if (!user.user.signedIn) {
                  localStorage.setItem("pageBeforeSignIn", location.pathname)
                  navigate("/auth")
                  return
                }
                if (!user.user.member) {
                  global.setShowMemberOnlyModal(true)
                } else {
                  setShowHelpModal(true)
                  // TODO: maybe allow expanding or personalising the description
                }
              }}
            >
              {/* TODO: do <Show here that on hover shows the full AI description of the topic */}
              <ui.Tooltip label="Personalised AI Guide">
                <ui.Icon name="Sparkles" />
              </ui.Tooltip>
            </div>
          </div>
          <div class="flex h-full text-[12px] gap-4">
            <div></div>
            <div>
              <ui.FancyButton
                onClick={() => {
                  if (!user.user.signedIn) {
                    localStorage.setItem("pageBeforeSignIn", location.pathname)
                    navigate("/auth")
                    return
                  }
                  if (!user.user.member) {
                    global.setShowMemberOnlyModal(true)
                  } else {
                    // TODO: probably unsafe, should be a better way to do this
                    const topicName = window.location.href.split("/")[3]
                    navigate(`/${topicName}/edit`)
                  }
                }}
              >
                Improve Guide
              </ui.FancyButton>
            </div>
          </div>
        </div>
      </div>
      <div class={clsx("w-full gap-4 flex flex-col  rounded-[6px]")}>
        <GuideSummary />
        <For each={topic.globalTopic.latestGlobalGuide?.sections}>
          {(section, id) => {
            return (
              <div
                style={{
                  animation: `DefaultSlide ${
                    id() * 0.2 + 0.2
                  }s ease-in forwards`
                }}
              >
                <GuideSection
                  title={section.title}
                  // @ts-ignore
                  links={section.links}
                  summary={section.summary}
                />
              </div>
            )
          }}
        </For>
      </div>
    </>
  )
}
