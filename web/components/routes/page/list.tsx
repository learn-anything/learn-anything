"use client"

import React, { useEffect, useCallback, useState, useRef, useMemo } from "react"
import { Primitive } from "@radix-ui/react-primitive"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import { cn } from "@/lib/utils"
import { useAccount } from "@/lib/providers/jazz-provider"
import Link from "next/link"
import { PersonalPage } from "@/lib/schema"
import { useAtom } from "jotai"
import { commandPaletteOpenAtom } from "@/components/custom/command-palette/command-palette"

interface PageListProps {
	activeItemIndex: number | null
	setActiveItemIndex: React.Dispatch<React.SetStateAction<number | null>>
	disableEnterKey: boolean
}

const ColumnHeader: React.FC<{
	id: string
	title: string
	width?: string
	minWidth?: string
	maxWidth?: string
}> = ({ id, title, width, minWidth, maxWidth }) => (
	<div
		data-column-id={id}
		className={cn(
			"flex flex-row items-center",
			"w-[var(--column-width)] min-w-[var(--column-min-width,min-content)] max-w-[min(var(--column-width),var(--column-max-width))] shrink-[2] grow basis-[var(--column-width)]"
		)}
		style={
			{
				justifyContent: "flex-start",
				"--column-width": width || "auto",
				"--column-min-width": minWidth || "min-content",
				"--column-max-width": maxWidth || "none"
			} as React.CSSProperties
		}
	>
		<span className="pr-3 text-left text-xs">{title}</span>
	</div>
)

const TeamRow = React.forwardRef<
	HTMLAnchorElement,
	{
		page: PersonalPage
		isActive: boolean
		setActiveItemIndex: React.Dispatch<React.SetStateAction<number | null>>
		index: number
	}
>(({ page, isActive, setActiveItemIndex, index }, ref) => (
	<Link
		ref={ref}
		tabIndex={isActive ? 0 : -1}
		className={cn("relative block cursor-default outline-none", {
			"bg-muted-foreground/10": isActive,
			"hover:bg-muted/50": !isActive
		})}
		href={`/pages/${page.id}`}
		onClick={e => {
			e.preventDefault()
			setActiveItemIndex(index)
		}}
	>
		<div className="flex h-full items-center gap-1.5 py-3.5 pl-9 pr-[22px]">
			<div className="flex min-w-[200px] shrink grow basis-[var(--column-width)] flex-row">{page.title}</div>
			<ColumnHeader id="membership" title="testing" width="200px" minWidth="200px" maxWidth="200px" />
			<ColumnHeader id="members" title={page.topic?.prettyName || ""} width="65px" minWidth="120px" maxWidth="200px" />
			<ColumnHeader
				id="projects"
				title={page.createdAt.toLocaleDateString()}
				width="82px"
				minWidth="82px"
				maxWidth="82px"
			/>
			<div className="flex shrink-0 flex-row items-center" style={{ width: "28px" }}>
				<Button variant="ghost">
					<LaIcon name="Ellipsis" />
				</Button>
			</div>
		</div>
	</Link>
))

TeamRow.displayName = "TeamRow"

export const PageList: React.FC<PageListProps> = ({ activeItemIndex, setActiveItemIndex, disableEnterKey }) => {
	const [isCommandPaletteOpen] = useAtom(commandPaletteOpenAtom)
	const { me } = useAccount({ root: { personalPages: [] } })
	const personalPages = useMemo(() => me?.root?.personalPages || [], [me?.root?.personalPages])
	const listRef = useRef<HTMLDivElement>(null)
	const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])

	const scrollIntoView = useCallback((index: number) => {
		if (itemRefs.current[index]) {
			itemRefs.current[index]?.scrollIntoView({
				block: "nearest"
			})
		}
	}, [])

	useEffect(() => {
		if (activeItemIndex !== null) {
			scrollIntoView(activeItemIndex)
		}
	}, [activeItemIndex, scrollIntoView])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isCommandPaletteOpen || !me?.root.personalPages) return

			if (e.key === "ArrowUp" || e.key === "ArrowDown") {
				e.preventDefault()
				setActiveItemIndex(prevIndex => {
					if (prevIndex === null) return 0
					const newIndex =
						e.key === "ArrowUp" ? Math.max(0, prevIndex - 1) : Math.min(personalPages.length - 1, prevIndex + 1)
					return newIndex
				})
			} else if (e.key === "Enter" && !disableEnterKey) {
				e.preventDefault()
				if (activeItemIndex !== null) {
					const activePage = personalPages[activeItemIndex]
					// Handle active page selection
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [
		me?.root?.personalPages,
		isCommandPaletteOpen,
		activeItemIndex,
		setActiveItemIndex,
		disableEnterKey,
		personalPages
	])

	return (
		<div className="flex h-full w-full flex-col">
			<div className="flex h-8 shrink-0 grow-0 flex-row gap-1.5 border-b pl-8 pr-[22px]">
				<ColumnHeader id="title" title="Title" minWidth="200px" />
				<ColumnHeader id="content" title="Content" width="200px" minWidth="200px" maxWidth="200px" />
				<ColumnHeader id="topic" title="Topic" width="65px" minWidth="120px" maxWidth="200px" />
				<ColumnHeader id="createdAt" title="Created At" width="82px" minWidth="82px" maxWidth="82px" />
				<div className="flex shrink-0 flex-row items-center" style={{ width: "28px" }}></div>
				<div
					data-column-id="scrollbar_spacer"
					className="-ml-1.5 flex min-w-[var(--column-width)] shrink-0 flex-row"
				></div>
			</div>
			<Primitive.div
				ref={listRef}
				className="flex flex-1 flex-col overflow-y-auto outline-none [scrollbar-gutter:stable]"
				tabIndex={-1}
			>
				<div className="relative">
					{personalPages.map(
						(page, index) =>
							page?.id && (
								<TeamRow
									key={page.id}
									ref={(el: HTMLAnchorElement | null) => {
										itemRefs.current[index] = el
									}}
									index={index}
									page={page}
									isActive={index === activeItemIndex}
									setActiveItemIndex={setActiveItemIndex}
								/>
							)
					)}
				</div>
			</Primitive.div>
		</div>
	)
}
