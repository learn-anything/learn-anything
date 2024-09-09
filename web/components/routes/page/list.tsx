import React from "react"
import { Primitive } from "@radix-ui/react-primitive"
import { useAccount } from "@/lib/providers/jazz-provider"
import { useAtom } from "jotai"
import { commandPaletteOpenAtom } from "@/components/custom/command-palette/command-palette"
import { PageItem } from "./partials/page-item"
import { useKeyboardNavigation } from "./hooks/use-keyboard-navigation"
import { useMedia } from "react-use"
import { Column } from "./partials/column"
import { useColumnStyles } from "./hooks/use-column-styles"

interface PageListProps {
	activeItemIndex: number | null
	setActiveItemIndex: React.Dispatch<React.SetStateAction<number | null>>
	disableEnterKey: boolean
}

export const PageList: React.FC<PageListProps> = ({ activeItemIndex, setActiveItemIndex, disableEnterKey }) => {
	const isTablet = useMedia("(max-width: 640px)")
	const [isCommandPaletteOpen] = useAtom(commandPaletteOpenAtom)
	const { me } = useAccount({ root: { personalPages: [] } })
	const personalPages = me?.root?.personalPages || []

	const { listRef, itemRefs } = useKeyboardNavigation({
		itemCount: personalPages.length,
		activeItemIndex,
		setActiveItemIndex,
		isCommandPaletteOpen,
		disableEnterKey
	})

	return (
		<div className="flex h-full w-full flex-col">
			{!isTablet && <ColumnHeader />}
			<PageListItems
				listRef={listRef}
				itemRefs={itemRefs}
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
			{/* <Column.Wrapper style={columnStyles.content}>
				<Column.Text>Content</Column.Text>
			</Column.Wrapper> */}
			<Column.Wrapper style={columnStyles.topic}>
				<Column.Text>Topic</Column.Text>
			</Column.Wrapper>
			<Column.Wrapper style={columnStyles.updated} className="justify-end">
				<Column.Text>Updated</Column.Text>
			</Column.Wrapper>
		</div>
	)
}

interface PageListItemsProps {
	listRef: React.RefObject<HTMLDivElement>
	itemRefs: React.MutableRefObject<(HTMLAnchorElement | null)[]>
	personalPages: any[]
	activeItemIndex: number | null
}

const PageListItems: React.FC<PageListItemsProps> = ({ listRef, itemRefs, personalPages, activeItemIndex }) => (
	<Primitive.div
		ref={listRef}
		className="flex flex-1 flex-col overflow-y-auto outline-none [scrollbar-gutter:stable]"
		tabIndex={-1}
		role="list"
	>
		{personalPages.map(
			(page, index) =>
				page?.id && (
					<PageItem
						key={page.id}
						ref={(el: HTMLAnchorElement | null) => {
							itemRefs.current[index] = el
						}}
						page={page}
						isActive={index === activeItemIndex}
					/>
				)
		)}
	</Primitive.div>
)
