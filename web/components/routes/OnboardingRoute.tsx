import { LaIcon } from "../custom/la-icon"
import { useState } from "react"

const steps = [
	{
		number: 1,
		title: "Create link",
		description:
			"Links are essentially bookmarks of things from internet. You can create a link by pressing Links button in left sidebar. Then pressing + button on the bottom.",
		task: "create any link with any title or description (for example, you can add https://learn-anything.xyz as link)"
	},
	{
		number: 2,
		title: "Create page",
		description:
			"Pages are things with content inside (images, text, anything). You can think of them as Notion pages. To create page, press the + button next to pages, then create title and put some content.",
		task: "create any page with any content inside"
	},
	{
		number: 3,
		title: "Start tracking learning status of some topic",
		description:
			"What makes Learn Anything different from Notion and other tools is notion of topics. A topic is anything after learn-anything.xyz/<topic>, for example learn-anything.xyz/typescript. You can go to the page, then on top right corner where it says add to my profile, press it and change the state of the topic to I want to learn, Learning or Learned.",
		task: "go to any topic, and mark it as I want to learn"
	},
	{
		number: 4,
		title: "Add a link from a topic into personal link collection",
		description:
			"If you noticed, there are links attached to topics as a list. This is the topic's study guide. It will be improved greatly in future and we will allow any user to edit these study guides too (Reddit style). You can click on the circle to left of the links and add a link to your personal collection with learning status too.",
		task: "add any link from topic typescript into your personal collection"
	}
]

const StepItem = ({
	number,
	title,
	description,
	task
}: {
	number: number
	title: string
	description: string
	task: string
}) => (
	<div className="flex items-start space-x-4 py-4">
		<div className="w-8 flex-shrink-0 opacity-50">{number}</div>
		<div className="flex-grow">
			<h3 className="font-semibold">{title}</h3>
			<p className="opacity-50">{description}</p>
			<p>{task}</p>
		</div>
	</div>
)

export default function OnboardingRoute() {
	return (
		<div className="flex flex-1 flex-col space-y-10 text-sm text-black dark:text-white">
			<div className="ml-10 flex flex-col items-start border-b border-neutral-200 bg-inherit dark:border-neutral-900">
				<p className="h-[74px] p-[20px] text-2xl font-semibold opacity-60">Onboarding</p>
			</div>
			<div className="mx-auto w-[70%] rounded-lg border border-neutral-200 bg-inherit p-6 shadow dark:border-neutral-900">
				<h2 className="mb-4 text-lg font-semibold">Complete the steps below to get started</h2>
				<div className="divide-y">
					{steps.map(step => (
						<StepItem key={step.number} {...step} />
					))}
				</div>
			</div>
		</div>
	)
}
