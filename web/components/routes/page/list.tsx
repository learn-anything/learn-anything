import React, { useMemo, useCallback } from "react"
import { Primitive } from "@radix-ui/react-primitive"
import { useAccount } from "@/lib/providers/jazz-provider"
import { useAtom } from "jotai"
import { commandPaletteOpenAtom } from "@/components/custom/command-palette/command-palette"
import { PageItem } from "./partials/page-item"
import { useKeyboardNavigation } from "./hooks/use-keyboard-navigation"
import { useMedia } from "react-use"
import { Column } from "./partials/column"
import { useColumnStyles } from "./hooks/use-column-styles"
import { PersonalPage, PersonalPageLists } from "@/lib/schema"
import { useRouter } from "next/navigation"

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

	const handleEnter = useCallback(
		(selectedPage: PersonalPage) => {
			router.push(`/pages/${selectedPage.id}`)
		},
		[router]
	)

	const { listRef, setItemRef } = useKeyboardNavigation({
		personalPages,
		activeItemIndex,
		setActiveItemIndex,
		isCommandPaletteOpen,
		disableEnterKey,
		onEnter: handleEnter
	})

	return (
		<div className="flex h-full w-full flex-col">
			{!isTablet && <ColumnHeader />}
			<PageListItems
				listRef={listRef}
				setItemRef={setItemRef}
				personalPages={personalPages}
				activeItemIndex={activeItemIndex}
			/>
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
	listRef: React.RefObject<HTMLDivElement>
	setItemRef: (el: HTMLAnchorElement | null, index: number) => void
	personalPages?: PersonalPageLists | null
	activeItemIndex: number | null
}

const PageListItems: React.FC<PageListItemsProps> = ({ listRef, setItemRef, personalPages, activeItemIndex }) => (
	<Primitive.div
		ref={listRef}
		className="divide-primary/5 mx-auto my-2 flex w-[99%] flex-1 flex-col divide-y overflow-y-auto outline-none [scrollbar-gutter:stable]"
		tabIndex={-1}
		role="list"
	>
		{personalPages?.map(
			(page, index) =>
				page?.id && (
					<PageItem
						key={page.id}
						ref={(el: HTMLAnchorElement | null) => setItemRef(el, index)}
						page={page}
						isActive={index === activeItemIndex}
					/>
				)
		)}
	</Primitive.div>
)
