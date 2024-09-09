import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PersonalPage } from "@/lib/schema"
import styles from "./list.module.css"
import { Badge } from "@/components/ui/badge"

interface PageItemProps {
	page: PersonalPage
	isActive: boolean
	setActiveItemIndex: React.Dispatch<React.SetStateAction<number | null>>
	index: number
}

export const PageItem = React.forwardRef<HTMLAnchorElement, PageItemProps>(
	({ page, isActive, setActiveItemIndex, index }, ref) => {
		return (
			<Link
				ref={ref}
				tabIndex={isActive ? 0 : -1}
				className={cn(
					"relative block cursor-default outline-none",
					"hover:bg-muted/50 h-12 items-center gap-x-2 py-2 max-lg:px-4 sm:px-5",
					{
						"bg-muted-foreground/10": isActive,
						"hover:bg-muted/50": !isActive
					}
				)}
				href={`/pages/${page.id}`}
				onClick={e => {
					e.preventDefault()
					setActiveItemIndex(index)
				}}
				role="listitem"
				aria-selected={isActive}
			>
				<div className="flex h-full items-center gap-1.5">
					<div
						className={cn("flex-start flex shrink-[2] grow flex-row items-center truncate", styles.column)}
						style={
							{
								"--column-width": "69px",
								"--column-min-width": "200px",
								"--column-max-width": "200px"
							} as React.CSSProperties
						}
					>
						<span className="text-left text-sm font-medium">{page.title}</span>
					</div>
					<div
						className={cn("flex-start flex shrink-[2] grow flex-row items-center truncate", styles.column)}
						style={
							{
								"--column-width": "auto",
								"--column-min-width": "200px",
								"--column-max-width": "200px"
							} as React.CSSProperties
						}
					>
						<span className="text-left text-sm">{page.slug}</span>
					</div>
					<div
						className={cn("flex-start flex shrink-[2] grow flex-row items-center truncate", styles.column)}
						style={
							{
								"--column-width": "65px",
								"--column-min-width": "120px",
								"--column-max-width": "200px"
							} as React.CSSProperties
						}
					>
						{page.topic && <Badge variant="secondary">{page.topic.prettyName}</Badge>}
					</div>
					<div
						className={cn("flex-start flex shrink-[2] grow flex-row items-center truncate", styles.column)}
						style={
							{
								"--column-width": "82px",
								"--column-min-width": "82px",
								"--column-max-width": "82px"
							} as React.CSSProperties
						}
					>
						<span className="text-right text-sm">{page.updatedAt.toLocaleDateString()}</span>
					</div>
				</div>
			</Link>
		)
	}
)

PageItem.displayName = "PageItem"
