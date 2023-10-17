import { For, Show } from "solid-js"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import GuideSummary from "./GuideSummary"
import clsx from "clsx"
import { useLocation, useNavigate } from "solid-start"
import { useGlobalState } from "../../GlobalContext/global"
import { useUser } from "../../GlobalContext/user"
import FancyButton from "../FancyButton"
import ModalWithMessageAndButton from "../ModalWithMessageAndButton"
import GuideSection from "./GuideSection"

export default function GlobalGuide() {
  const navigate = useNavigate()
  const topic = useGlobalTopic()
  const user = useUser()
  const global = useGlobalState()
  const location = useLocation()

  return (
    <>
      <div class="w-full flex flex-col gap-[20px] relative">
        <Show when={global.showMemberOnlyModal()}>
          <ModalWithMessageAndButton
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
        <div
          id="Guide"
          class="font-bold  flex w-full items-center justify-between"
        >
          <div class="text-[22px]">{topic.globalTopic.prettyName}</div>
          <div class="flex h-full text-[12px] gap-4">
            <div></div>
            <div>
              <FancyButton
                onClick={() => {
                  if (!user.user.signedIn) {
                    localStorage.setItem("pageBeforeSignIn", location.pathname)
                    navigate("/auth")
                    return
                  }
                  if (!user.user.member) {
                    console.log("runs")
                    global.setShowMemberOnlyModal(true)
                  } else {
                    // TODO: probably unsafe, should be a better way to do this
                    const topicName = window.location.href.split("/")[3]
                    console.log(topicName)
                    navigate(`/${topicName}/edit`)
                  }
                }}
              >
                Improve Guide
              </FancyButton>
            </div>
          </div>
        </div>
      </div>
      <div class={clsx("w-full gap-4 flex flex-col  rounded-[6px]")}>
        <GuideSummary />
        <For each={topic.globalTopic.latestGlobalGuide?.sections}>
          {(section) => {
            return (
              <GuideSection
                title={section.title}
                // @ts-ignore
                links={section.links}
                summary={section.summary}
              />
            )
          }}
        </For>
      </div>
    </>
  )
}
