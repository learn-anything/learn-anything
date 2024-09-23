import React, { useMemo, useCallback, useEffect } from "react"
import { Primitive } from "@radix-ui/react-primitive"
import { useAccount } from "@/lib/providers/jazz-provider"
import { useAtom } from "jotai"
import { commandPaletteOpenAtom } from "@/components/custom/command-palette/command-palette"
import { PageItem } from "./partials/page-item"
import { useMedia } from "@/hooks/use-media"
import { useColumnStyles } from "./hooks/use-column-styles"
import { PersonalPage, PersonalPageLists } from "@/lib/schema"
import { useRouter } from "next/navigation"
import { useActiveItemScroll } from "@/hooks/use-active-item-scroll"
import { Column } from "@/components/custom/column"

interface PageListProps {
	activeItemIndex: number | null
	setActiveItemIndex: React.Dispatch<React.SetStateAction<number | null>>
	disableEnterKey: boolean
}

export const PageList: React.FC<PageListProps> = ({ activeItemIndex, setActiveItemIndex, disableEnterKey }) => {
	const isTablet = useMedia("(max-width: 640px)")
	const [isCommandPaletteOpen] = useAtom(commandPaletteOpenAtom)
	const { me } = useAccount({ root: { personalPages: [] } })
	const personalPages = useMemo(() => me?.root?.personalPages, [me?.root?.personalPages])
	const router = useRouter()
	const itemCount = personalPages?.length || 0

	const handleEnter = useCallback(
		(selectedPage: PersonalPage) => {
			router.push(`/pages/${selectedPage.id}`)
		},
		[router]
	)

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (isCommandPaletteOpen) return

			if (e.key === "ArrowUp" || e.key === "ArrowDown") {
				e.preventDefault()
				setActiveItemIndex(prevIndex => {
					if (prevIndex === null) return 0
					const newIndex = e.key === "ArrowUp" ? (prevIndex - 1 + itemCount) % itemCount : (prevIndex + 1) % itemCount
					return newIndex
				})
			} else if (e.key === "Enter" && !disableEnterKey && activeItemIndex !== null && personalPages) {
				e.preventDefault()
				const selectedPage = personalPages[activeItemIndex]
				if (selectedPage) handleEnter?.(selectedPage)
			}
		},
		[itemCount, isCommandPaletteOpen, activeItemIndex, setActiveItemIndex, disableEnterKey, personalPages, handleEnter]
	)

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [handleKeyDown])

	return (
		<div className="flex h-full w-full flex-col overflow-hidden border-t">
			{!isTablet && <ColumnHeader />}
			<PageListItems personalPages={personalPages} activeItemIndex={activeItemIndex} />
		</div>
	)
}

export const ColumnHeader: React.FC = () => {
	const columnStyles = useColumnStyles()

	return (
		<div className="flex h-8 shrink-0 grow-0 flex-row gap-4 border-b max-lg:px-4 sm:px-6">
			<Column.Wrapper style={columnStyles.title}>
				<Column.Text>Title</Column.Text>
			</Column.Wrapper>
			<Column.Wrapper style={columnStyles.topic}>
				<Column.Text>Topic</Column.Text>
			</Column.Wrapper>
			<Column.Wrapper style={columnStyles.updated}>
				<Column.Text>Updated</Column.Text>
			</Column.Wrapper>
		</div>
	)
}

interface PageListItemsProps {
	personalPages?: PersonalPageLists | null
	activeItemIndex: number | null
}

const PageListItems: React.FC<PageListItemsProps> = ({ personalPages, activeItemIndex }) => {
	const { setElementRef } = useActiveItemScroll<HTMLAnchorElement>({ activeIndex: activeItemIndex })

	return (
		<Primitive.div
			className="divide-primary/5 flex flex-1 flex-col divide-y overflow-y-auto outline-none [scrollbar-gutter:stable]"
			tabIndex={-1}
			role="list"
		>
			{personalPages?.map(
				(page, index) =>
					page?.id && (
						<PageItem
							key={page.id}
							ref={el => setElementRef(el, index)}
							page={page}
							isActive={index === activeItemIndex}
						/>
					)
			)}
		</Primitive.div>
	)
}
