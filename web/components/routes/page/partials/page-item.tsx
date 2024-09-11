import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PersonalPage } from "@/lib/schema"
import { Badge } from "@/components/ui/badge"
import { Column } from "./column"
import { useMedia } from "react-use"
import { useColumnStyles } from "../hooks/use-column-styles"
import { format } from "date-fns"

interface PageItemProps {
	page: PersonalPage
	isActive: boolean
}

export const PageItem = React.forwardRef<HTMLAnchorElement, PageItemProps>(({ page, isActive }, ref) => {
	const isTablet = useMedia("(max-width: 640px)")
	const columnStyles = useColumnStyles()

	return (
		<Link
			ref={ref}
			tabIndex={isActive ? 0 : -1}
			className={cn(
				"relative block cursor-default rounded-lg outline-none",
				"h-12 items-center gap-x-2 py-2 max-lg:px-4 sm:px-6",
				{
					"bg-muted-foreground/10": isActive,
					"hover:bg-muted/50": !isActive
				}
			)}
			href={`/pages/${page.id}`}
			role="listitem"
		>
			<div className="flex h-full items-center gap-4">
				<Column.Wrapper style={columnStyles.title}>
					<Column.Text className="truncate text-[13px] font-medium">{page.title || "Untitled"}</Column.Text>
				</Column.Wrapper>

				{!isTablet && (
					<>
						{/* <Column.Wrapper style={columnStyles.content}>
							<Column.Text className="text-[13px]">{page.slug}</Column.Text>
						</Column.Wrapper> */}
						<Column.Wrapper style={columnStyles.topic}>
							{page.topic && <Badge variant="secondary">{page.topic.prettyName}</Badge>}
						</Column.Wrapper>
					</>
				)}

				<Column.Wrapper style={columnStyles.updated} className="flex justify-end">
					<Column.Text className="text-[13px]">{format(new Date(page.updatedAt), "d MMM yyyy")}</Column.Text>
				</Column.Wrapper>
			</div>
		</Link>
	)
})

PageItem.displayName = "PageItem"
