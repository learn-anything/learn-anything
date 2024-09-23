"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { useAtom } from "jotai"
import { isCollapseAtom, toggleCollapseAtom } from "@/store/sidebar"
import { useMedia } from "@/hooks/use-media"
import { cn } from "@/lib/utils"
import { LaIcon } from "./la-icon"

type ContentHeaderProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title">

export const ContentHeader = React.forwardRef<HTMLDivElement, ContentHeaderProps>(
	({ children, className, ...props }, ref) => {
		return (
			<header
				className={cn(
					"flex min-h-10 min-w-0 shrink-0 items-center gap-3 pl-8 pr-6 transition-opacity max-lg:px-4",
					className
				)}
				ref={ref}
				{...props}
			>
				{children}
			</header>
		)
	}
)

ContentHeader.displayName = "ContentHeader"

export const SidebarToggleButton: React.FC = () => {
	const [isCollapse] = useAtom(isCollapseAtom)
	const [, toggle] = useAtom(toggleCollapseAtom)
	const isTablet = useMedia("(max-width: 1024px)")

	if (!isCollapse && !isTablet) return null

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		e.stopPropagation()
		toggle()
	}

	return (
		<div className="flex items-center gap-1">
			<Button
				type="button"
				size="icon"
				variant="ghost"
				aria-label="Menu"
				className="text-primary/60"
				onClick={handleClick}
			>
				<LaIcon name="PanelLeft" />
			</Button>
		</div>
	)
}
