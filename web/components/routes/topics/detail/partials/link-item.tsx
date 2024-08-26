import React from "react"
import Link from "next/link"
import { LaIcon } from "@/components/custom/la-icon"
import { cn, ensureUrlProtocol } from "@/lib/utils"
import { Link as LinkSchema } from "@/lib/schema"

interface LinkItemProps {
	link: LinkSchema
	isActive: boolean
	index: number
	setActiveIndex: (index: number) => void
}

export const LinkItem = React.forwardRef<HTMLLIElement, LinkItemProps>(
	({ link, isActive, index, setActiveIndex }, ref) => {
		const handleClick = (e: React.MouseEvent) => {
			e.preventDefault()
			setActiveIndex(index)
		}

		return (
			<li
				ref={ref}
				tabIndex={0}
				onClick={handleClick}
				className={cn(
					"hover:bg-muted/50 relative flex h-14 cursor-pointer items-center outline-none xl:h-11",
					isActive && "bg-muted/50"
				)}
			>
				<div className="flex grow justify-between gap-x-6 px-6 max-lg:px-4">
					<div className="flex min-w-0 items-center gap-x-4">
						<LaIcon name="GraduationCap" className="size-5 shrink-0" />
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
