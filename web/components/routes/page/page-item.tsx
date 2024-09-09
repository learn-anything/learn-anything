import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PersonalPage } from "@/lib/schema"
import { Badge } from "@/components/ui/badge"
import { Column, COLUMN_STYLES } from "./list"

interface PageItemProps {
	page: PersonalPage
	isActive: boolean
}

export const PageItem = React.forwardRef<HTMLAnchorElement, PageItemProps>(({ page, isActive }, ref) => {
	return (
		<Link
			ref={ref}
			tabIndex={isActive ? 0 : -1}
			className={cn(
				"relative block cursor-default outline-none",
				"h-12 items-center gap-x-2 py-2 max-lg:px-4 sm:px-6",
				{
					"bg-muted-foreground/10": isActive,
					"hover:bg-muted/50": !isActive
				}
			)}
			href={`/pages/${page.id}`}
			role="listitem"
			aria-selected={isActive}
		>
			<div className="flex h-full items-center gap-1.5">
				<Column.Wrapper style={COLUMN_STYLES.title}>
					<Column.Text className="text-[13px] font-medium">{page.title}</Column.Text>
				</Column.Wrapper>
				<Column.Wrapper style={COLUMN_STYLES.content}>
					<Column.Text className="text-[13px]">{page.slug}</Column.Text>
				</Column.Wrapper>
				<Column.Wrapper style={COLUMN_STYLES.topic}>
					{page.topic && <Badge variant="secondary">{page.topic.prettyName}</Badge>}
				</Column.Wrapper>
				<Column.Wrapper style={COLUMN_STYLES.updated} className="justify-end">
					<Column.Text className="text-[13px]">{page.updatedAt.toLocaleDateString()}</Column.Text>
				</Column.Wrapper>
			</div>
		</Link>
	)
})

PageItem.displayName = "PageItem"
