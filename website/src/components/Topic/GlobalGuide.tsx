import { For, Show, createSignal } from "solid-js"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import Icon from "../Icon"
import GuideSummary from "./GuideSummary"
// @ts-ignore
import { Motion } from "@motionone/solid"
import { useLocation, useNavigate } from "solid-start"
import GuideSection from "./GuideSection"
import FancyButton from "../FancyButton"
import Modal from "../Modal"
import ModalWithMessageAndButton from "../ModalWithMessageAndButton"
import { useUser } from "../../GlobalContext/user"
import { div } from "edgedb/dist/primitives/bigint"
import clsx from "clsx"

export default function GlobalGuide() {
  const navigate = useNavigate()
  const topic = useGlobalTopic()
  const user = useUser()
  const location = useLocation()
  const [showModal, setShowModal] = createSignal(false)

  return (
    <>
      <div class="w-full flex flex-col gap-[20px] relative">
        <Show when={showModal()}>
          <ModalWithMessageAndButton
            message="This is a member only feature"
            buttonText="Become Member"
            buttonAction={() => {
              navigate("/pricing")
            }}
            onClose={() => {
              setShowModal(false)
            }}
          />
        </Show>
        <div
          id="Guide"
          class="font-bold  flex w-full items-center justify-between"
        >
          <div class="text-[22px]">{topic.globalTopic.prettyName}</div>
          <div class="flex h-full text-[12px] gap-4">
            <div
            // transition={{ duration: 1.2, easing: "ease-out" }}
            // animate={{
            //   opacity: [0, 1, 1],
            //   transform: [
            //     "translateX(100px)",
            //     "translateX(-10px)",
            //     "translateX(0px)"
            //   ]
            // }}
            // class="border border-[#69696951] flex items-center justify-center bg-opacity-40 text-[#696969]  hover:bg-gray-100 transition-all px-3 font-light rounded-[4px] text-[14px] p-1 cursor-pointer"
            >
              {/* Filter */}
              {/* <FancyButton>Filter</FancyButton> */}
            </div>
            <div
            // transition={{ duration: 1, easing: "ease-out", delay: 0.1 }}
            // animate={{
            //   opacity: [0, 1, 1],
            //   transform: [
            //     "translateX(100px)",
            //     "translateX(-10px)",
            //     "translateX(0px)"
            //   ]
            // }}
            // class="bg-blue-600 flex items-center justify-center bg-opacity-60 text-white hover:text-white hover:bg-blue-600 transition-all px-3 font-light rounded-[4px] text-[14px] p-1 cursor-pointer"
            >
              {/* Improve Guide */}
              <FancyButton
                onClick={() => {
                  console.log(user.user.member)
                  if (!user.user.signedIn) {
                    localStorage.setItem("pageBeforeSignIn", location.pathname)
                    navigate("/auth")
                    return
                  }
                  if (user.user.member) {
                    setShowModal(true)
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
            {/* <FancyButton>Improve Guide</FancyButton> */}
            {/* <div
            // transition={{ duration: 1, easing: "ease-out", delay: 0.2 }}
            // animate={{
            //   opacity: [0, 1, 1],
            //   transform: [
            //     "translateX(100px)",
            //     "translateX(-10px)",
            //     "translateX(0px)"
            //   ]
            // }}
            // class="bg-gray-100 dark:bg-[#161616] hover:bg-gray-200 dark:hover:bg-black transition-all flex items-center justify-center rounded-[4px] h-[29px] w-[29px] text-[14px] cursor-pointer"
            >
              <FancyButton>
                <Icon name="Options" />
              </FancyButton>
            </div> */}
          </div>
        </div>
      </div>

      <div
        // transition={{ duration: 1, easing: "ease-out" }}
        // animate={{
        //   opacity: [0, 1, 1],
        //   transform: [
        //     "translateX(100px)",
        //     "translateX(-10px)",
        //     "translateX(0px)"
        //   ]
        // }}
        class={clsx("w-full gap-4 flex flex-col  rounded-[6px]")}
      >
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
