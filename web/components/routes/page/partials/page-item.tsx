import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PersonalPage } from "@/lib/schema"
import { Badge } from "@/components/ui/badge"
import { useMedia } from "@/hooks/use-media"
import { useColumnStyles } from "../hooks/use-column-styles"
import { format } from "date-fns"
import { Column } from "@/components/custom/column"
import { useRouter } from "next/navigation"

interface PageItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
	page: PersonalPage
	isActive: boolean
}

export const PageItem = React.forwardRef<HTMLAnchorElement, PageItemProps>(({ page, isActive, ...props }, ref) => {
	const isTablet = useMedia("(max-width: 640px)")
	const columnStyles = useColumnStyles()
	const router = useRouter()

	const handleKeyDown = React.useCallback(
		(ev: React.KeyboardEvent<HTMLAnchorElement>) => {
			if (ev.key === "Enter") {
				ev.preventDefault()
				ev.stopPropagation()
				router.push(`/pages/${page.id}`)
			}
		},
		[router, page.id]
	)

	return (
		<Link
			ref={ref}
			tabIndex={isActive ? 0 : -1}
			className={cn(
				"relative block cursor-default outline-none",
				"min-h-12 py-2 max-lg:px-4 sm:px-6",
				"data-[active='true']:bg-[var(--link-background-muted)] data-[keyboard-active='true']:focus-visible:shadow-[var(--link-shadow)_0px_0px_0px_1px_inset]"
			)}
			href={`/pages/${page.id}`}
			aria-selected={isActive}
			data-active={isActive}
			onKeyDown={handleKeyDown}
			{...props}
		>
			<div className="flex h-full items-center gap-4">
				<Column.Wrapper style={columnStyles.title}>
					<Column.Text className="truncate text-[13px] font-medium">{page.title || "Untitled"}</Column.Text>
				</Column.Wrapper>

				{!isTablet && (
					<Column.Wrapper style={columnStyles.topic}>
						{page.topic && <Badge variant="secondary">{page.topic.prettyName}</Badge>}
					</Column.Wrapper>
				)}

				<Column.Wrapper style={columnStyles.updated} className="flex justify-end">
					<Column.Text className="text-[13px]">{format(new Date(page.updatedAt), "d MMM yyyy")}</Column.Text>
				</Column.Wrapper>
			</div>
		</Link>
	)
})

PageItem.displayName = "PageItem"
