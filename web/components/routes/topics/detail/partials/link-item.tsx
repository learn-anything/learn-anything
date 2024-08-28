import React, { useMemo } from "react"
import Link from "next/link"
import { LaIcon } from "@/components/custom/la-icon"
import { cn, ensureUrlProtocol, generateUniqueSlug } from "@/lib/utils"
import { LaAccount, Link as LinkSchema, PersonalLink, PersonalLinkLists, UserRoot } from "@/lib/schema"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useAtom } from "jotai"
import { openPopoverForIdAtom } from "../TopicDetailRoute"
import { LearningStateSelectorContent } from "@/components/custom/learning-state-selector"
import { LEARNING_STATES, LearningStateValue } from "@/lib/constants"
import { toast, ToastT } from "sonner"
import { useRouter } from "next/navigation"
interface LinkItemProps {
	link: LinkSchema
	isActive: boolean
	index: number
	setActiveIndex: (index: number) => void
	me: {
		root: {
			personalLinks: PersonalLinkLists
		} & UserRoot
	} & LaAccount
	personalLinks: PersonalLinkLists
}

export const LinkItem = React.forwardRef<HTMLLIElement, LinkItemProps>(
	({ link, isActive, index, setActiveIndex, me, personalLinks }, ref) => {
		const router = useRouter()
		const [openPopoverForId, setOpenPopoverForId] = useAtom(openPopoverForIdAtom)
		const personalLink = useMemo(() => {
			return personalLinks.find(pl => pl?.link?.id === link.id)
		}, [personalLinks, link.id])

		const selectedLearningState = LEARNING_STATES.find(ls => ls.value === personalLink?.learningState)

		const handleClick = (e: React.MouseEvent) => {
			e.preventDefault()
			setActiveIndex(index)
		}

		const handleSelectLearningState = (learningState: LearningStateValue) => {
			let defaultToast: Partial<ToastT> = {
				duration: 5000,
				position: "bottom-right",
				closeButton: true,
				action: {
					label: "Go to list",
					onClick: () => {
						router.push("/")
					}
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
				const payload = {
					url: link.url,
					title: link.title,
					slug: slug,
					link: link,
					learningState,
					sequence: personalLinks.length + 1,
					completed: false,
					createdAt: new Date(),
					updatedAt: new Date()
				}

				const newPersonalLink = PersonalLink.create(payload, { owner: me })
				personalLinks.push(newPersonalLink)

				toast.success("Link added.", {
					...defaultToast,
					description: `${link.title} has been added to your personal link.`
				})
			}

			setOpenPopoverForId(null)
		}

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
						<Popover
							open={openPopoverForId === link.id}
							onOpenChange={(open: boolean) => setOpenPopoverForId(open ? link.id : null)}
						>
							<PopoverTrigger asChild>
								<Button
									size="sm"
									type="button"
									role="combobox"
									variant="secondary"
									className={cn("size-7 shrink-0 p-0", "hover:bg-accent-foreground/10")}
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
									searchPlaceholder={"Search state..."}
									value={personalLink?.learningState}
									onSelect={(value: string) => {
										handleSelectLearningState(value as LearningStateValue)
									}}
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
										className="text-muted-foreground group-hover:text-primary size-3 flex-none"
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
	}
)

LinkItem.displayName = "LinkItem"
