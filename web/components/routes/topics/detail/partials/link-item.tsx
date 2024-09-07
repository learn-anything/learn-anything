import React, { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAtom } from "jotai"
import { toast } from "sonner"

import { LaIcon } from "@/components/custom/la-icon"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { LearningStateSelectorContent } from "@/components/custom/learning-state-selector"

import { cn, ensureUrlProtocol, generateUniqueSlug } from "@/lib/utils"
import { Link as LinkSchema, PersonalLink, Topic } from "@/lib/schema"
import { openPopoverForIdAtom } from "../TopicDetailRoute"
import { LEARNING_STATES, LearningStateValue } from "@/lib/constants"
import { useAccountOrGuest } from "@/lib/providers/jazz-provider"

interface LinkItemProps {
	topic: Topic
	link: LinkSchema
	isActive: boolean
	index: number
	setActiveIndex: (index: number) => void
}

export const LinkItem = React.memo(
	React.forwardRef<HTMLLIElement, LinkItemProps>(({ topic, link, isActive, index, setActiveIndex }, ref) => {
		const router = useRouter()
		const [, setOpenPopoverForId] = useAtom(openPopoverForIdAtom)
		const [isPopoverOpen, setIsPopoverOpen] = useState(false)

		const { me } = useAccountOrGuest({ root: { personalLinks: [] } })

		const personalLinks = useMemo(() => {
			if (!me || me._type === "Anonymous") return undefined
			return me?.root?.personalLinks || []
		}, [me])

		const personalLink = useMemo(() => {
			return personalLinks?.find(pl => pl?.link?.id === link.id)
		}, [personalLinks, link.id])

		const selectedLearningState = useMemo(() => {
			return LEARNING_STATES.find(ls => ls.value === personalLink?.learningState)
		}, [personalLink?.learningState])

		const handleClick = useCallback(
			(e: React.MouseEvent) => {
				e.preventDefault()
				setActiveIndex(index)
			},
			[index, setActiveIndex]
		)

		const handleSelectLearningState = useCallback(
			(learningState: LearningStateValue) => {
				if (!personalLinks || !me || me?._type === "Anonymous") {
					if (me?._type === "Anonymous") {
						// TODO: handle better
						toast.error("You need to sign in to add links to your personal list.")
					}
					return
				}

				const defaultToast = {
					duration: 5000,
					position: "bottom-right" as const,
					closeButton: true,
					action: {
						label: "Go to list",
						onClick: () => router.push("/")
					}
				}

				if (personalLink) {
					if (personalLink.learningState === learningState) {
						personalLink.learningState = undefined
						toast.error("Link learning state removed", defaultToast)
					} else {
						personalLink.learningState = learningState
						toast.success("Link learning state updated", defaultToast)
					}
				} else {
					const slug = generateUniqueSlug(personalLinks.toJSON(), link.title)
					const newPersonalLink = PersonalLink.create(
						{
							url: link.url,
							title: link.title,
							slug,
							link,
							learningState,
							sequence: personalLinks.length + 1,
							completed: false,
							topic,
							createdAt: new Date(),
							updatedAt: new Date()
						},
						{ owner: me }
					)

					personalLinks.push(newPersonalLink)

					toast.success("Link added.", {
						...defaultToast,
						description: `${link.title} has been added to your personal link.`
					})
				}

				setOpenPopoverForId(null)
				setIsPopoverOpen(false)
			},
			[personalLink, personalLinks, me, link, router, setOpenPopoverForId, topic]
		)

		const handlePopoverOpenChange = useCallback(
			(open: boolean) => {
				setIsPopoverOpen(open)
				setOpenPopoverForId(open ? link.id : null)
			},
			[link.id, setOpenPopoverForId]
		)

		return (
			<li
				ref={ref}
				tabIndex={0}
				onClick={handleClick}
				className={cn("relative flex h-14 cursor-pointer items-center outline-none xl:h-11", {
					"bg-muted-foreground/10": isActive,
					"hover:bg-muted/50": !isActive
				})}
			>
				<div className="flex grow justify-between gap-x-6 px-6 max-lg:px-4">
					<div className="flex min-w-0 items-center gap-x-4">
						<Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
							<PopoverTrigger asChild>
								<Button
									size="sm"
									type="button"
									role="combobox"
									variant="secondary"
									className={cn("size-7 shrink-0 p-0", "hover:bg-accent-foreground/10")}
									onClick={e => e.stopPropagation()}
								>
									{selectedLearningState?.icon ? (
										<LaIcon name={selectedLearningState.icon} className={selectedLearningState.className} />
									) : (
										<LaIcon name="Circle" />
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="w-52 rounded-lg p-0"
								side="bottom"
								align="start"
								onCloseAutoFocus={e => e.preventDefault()}
							>
								<LearningStateSelectorContent
									showSearch={false}
									searchPlaceholder="Search state..."
									value={personalLink?.learningState}
									onSelect={(value: string) => handleSelectLearningState(value as LearningStateValue)}
								/>
							</PopoverContent>
						</Popover>

						<div className="w-full min-w-0 flex-auto">
							<div className="gap-x-2 space-y-0.5 xl:flex xl:flex-row">
								<p
									className={cn(
										"text-primary hover:text-primary line-clamp-1 text-sm font-medium xl:truncate",
										isActive && "font-bold"
									)}
								>
									{link.title}
								</p>

								<div className="group flex items-center gap-x-1">
									<LaIcon
										name="Link"
										aria-hidden="true"
										className="text-muted-foreground group-hover:text-primary flex-none"
									/>

									<Link
										href={ensureUrlProtocol(link.url)}
										passHref
										prefetch={false}
										target="_blank"
										onClick={e => e.stopPropagation()}
										className="text-muted-foreground hover:text-primary text-xs"
									>
										<span className="xl:truncate">{link.url}</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
					<div className="flex shrink-0 items-center gap-x-4"></div>
				</div>
			</li>
		)
	})
)

LinkItem.displayName = "LinkItem"
