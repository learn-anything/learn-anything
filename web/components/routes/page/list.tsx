import * as React from "react"
import { Primitive } from "@radix-ui/react-primitive"
import { useAccount } from "@/lib/providers/jazz-provider"
import { PageItem } from "./partials/page-item"
import { useMedia } from "@/hooks/use-media"
import { useColumnStyles } from "./hooks/use-column-styles"
import { useActiveItemScroll } from "@/hooks/use-active-item-scroll"
import { Column } from "@/components/custom/column"
import { useKeyDown } from "@/hooks/use-key-down"

interface PageListProps {}

export const PageList: React.FC<PageListProps> = () => {
	const isTablet = useMedia("(max-width: 640px)")
	const { me } = useAccount({ root: { personalPages: [] } })
	const [activeItemIndex, setActiveItemIndex] = React.useState<number | null>(null)
	const [keyboardActiveIndex, setKeyboardActiveIndex] = React.useState<number | null>(null)
	const personalPages = React.useMemo(() => me?.root?.personalPages, [me?.root?.personalPages])

	const next = () => Math.min((activeItemIndex ?? 0) + 1, (personalPages?.length ?? 0) - 1)

	const prev = () => Math.max((activeItemIndex ?? 0) - 1, 0)

	const handleKeyDown = (ev: KeyboardEvent) => {
		switch (ev.key) {
			case "ArrowDown":
				ev.preventDefault()
				ev.stopPropagation()
				setActiveItemIndex(next())
				setKeyboardActiveIndex(next())
				break
			case "ArrowUp":
				ev.preventDefault()
				ev.stopPropagation()
				setActiveItemIndex(prev())
				setKeyboardActiveIndex(prev())
		}
	}

	useKeyDown(() => true, handleKeyDown)

	const { setElementRef } = useActiveItemScroll<HTMLAnchorElement>({ activeIndex: keyboardActiveIndex })

	return (
		<div className="flex h-full w-full flex-col overflow-hidden border-t">
			{!isTablet && <ColumnHeader />}
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
								onPointerMove={() => {
									setKeyboardActiveIndex(null)
									setActiveItemIndex(index)
								}}
								data-keyboard-active={keyboardActiveIndex === index}
							/>
						)
				)}
			</Primitive.div>
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
