import * as React from "react"
import { atomWithStorage } from "jotai/utils"
import { useAccount } from "@/lib/providers/jazz-provider"
import { useAtom } from "jotai"

import { createFileRoute } from "@tanstack/react-router"
import { LaIcon } from "~/components/custom/la-icon"

export const Route = createFileRoute("/_layout/_pages/_protected/onboarding/")({
  component: () => <OnboardingComponent />,
})

const isCreateLinkDoneAtom = atomWithStorage("isCreateLinkDone", false)
const isCreatePageDoneAtom = atomWithStorage("isCreatePageDone", false)
const isStartTrackingDoneAtom = atomWithStorage("isStartTrackingDone", false)
const isAddLinkDoneAtom = atomWithStorage("isAddLinkDone", false)

const steps = [
  {
    number: 1,
    title: "Create Link",
    description:
      "Links are essentially bookmarks of things from internet. You can create a link by pressing Links button in left sidebar. Then pressing + button on the bottom.",
    task: "create any Link with any title or description (for example, you can add https://learn-anything.xyz as link)",
  },
  {
    number: 2,
    title: "Create Page",
    description:
      "Pages are things with content inside (images, text, anything). You can think of them as Notion pages. To create page, press the + button next to pages, then create title and put some content.",
    task: "create any Page with any content inside",
  },
  {
    number: 3,
    title: "Start tracking Learning status of some Topic",
    description:
      "What makes Learn Anything different from Notion and other tools is notion of topics. A topic is anything after learn-anything.xyz/<topic>, for example learn-anything.xyz/typescript. You can go to the page, then on top right corner where it says add to my profile, press it and change the state of the topic to I want to learn, Learning or Learned.",
    task: "go to any Topic, and mark it as I want to learn",
  },
  {
    number: 4,
    title: "Add a Link from a Topic into personal link collection",
    description:
      "If you noticed, there are links attached to topics as a list. This is the topic's study guide. It will be improved greatly in future and we will allow any user to edit these study guides too (Reddit style). You can click on the circle to left of the links and add a link to your personal collection with learning status too.",
    task: "add any Link from topic typescript into your personal collection",
  },
]

const StepItem = ({
  number,
  title,
  description,
  task,
  done,
}: {
  number: number
  title: string
  description: string
  task: string
  done: boolean
}) => (
  <div className="flex items-start space-x-4 py-4">
    <div className="w-6 flex-shrink-0 items-center justify-center rounded-3xl border border-foreground/20 text-center opacity-70">
      {number}
    </div>
    <div className="flex-grow space-y-2">
      <h3 className="font-semibold">{title}</h3>
      <p className="w-[90%] leading-relaxed opacity-70">{description}</p>
      <div className="flex flex-row items-center gap-2">
        <LaIcon
          name={done ? "SquareCheck" : "Square"}
          className={`${done ? "text-green-500" : ""}`}
        />
        <p className={`${done ? "opacity-35" : ""}`}>{task}</p>
      </div>
    </div>
  </div>
)

function OnboardingComponent() {
  const { me } = useAccount({
    root: {
      personalPages: [{}],
      personalLinks: [{}],
      topicsWantToLearn: [{}],
    },
  })

  const [isCreateLinkDone, setIsCreateLinkDone] = useAtom(isCreateLinkDoneAtom)
  const [isCreatePageDone, setIsCreatePageDone] = useAtom(isCreatePageDoneAtom)
  const [isStartTrackingDone, setIsStartTrackingDone] = useAtom(
    isStartTrackingDoneAtom,
  )
  const [isAddLinkDone, setIsAddLinkDone] = useAtom(isAddLinkDoneAtom)

  React.useEffect(() => {
    if (!me) return

    if (me.root.personalLinks.length > 0 && !isCreateLinkDone) {
      setIsCreateLinkDone(true)
    }

    if (me.root.personalPages.length > 0 && !isCreatePageDone) {
      setIsCreatePageDone(true)
    }

    if (me.root.topicsWantToLearn.length > 0 && !isStartTrackingDone) {
      setIsStartTrackingDone(true)
    }

    if (
      me.root.personalLinks.some(
        (link) => link?.topic?.name === "typescript",
      ) &&
      !isAddLinkDone
    ) {
      setIsAddLinkDone(true)
    }
  }, [
    me,
    isCreateLinkDone,
    isCreatePageDone,
    setIsCreateLinkDone,
    setIsCreatePageDone,
    isAddLinkDone,
    setIsAddLinkDone,
    isStartTrackingDone,
    setIsStartTrackingDone,
  ])

  const completedSteps = [
    isCreateLinkDone,
    isCreatePageDone,
    isStartTrackingDone,
    isAddLinkDone,
  ].filter(Boolean).length

  return (
    <div className="flex flex-1 flex-col space-y-4 text-sm text-black dark:text-white">
      <div className="ml-10 flex flex-col items-start border-b border-neutral-200 bg-inherit dark:border-neutral-900">
        <p className="h-[70px] p-[20px] text-2xl font-semibold opacity-60">
          Onboarding
        </p>
      </div>
      <div className="mx-auto w-[70%] rounded-lg border border-neutral-200 bg-inherit p-6 shadow dark:border-neutral-900">
        <h2 className="mb-4 text-lg font-semibold">
          Complete the steps below to get started
        </h2>
        <p className="mb-4">
          Completed {completedSteps} out of {steps.length} steps
        </p>
        <div className="divide-y">
          {steps.map((step, index) => (
            <StepItem
              key={step.number}
              {...step}
              done={
                [
                  isCreateLinkDone,
                  isCreatePageDone,
                  isStartTrackingDone,
                  isAddLinkDone,
                ][index]
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
