import React, { useMemo } from "react"
import { Primitive } from "@radix-ui/react-primitive"
import { cn } from "@/lib/utils"
import { useAccount } from "@/lib/providers/jazz-provider"
import { useAtom } from "jotai"
import { commandPaletteOpenAtom } from "@/components/custom/command-palette/command-palette"
import { PageItem } from "./page-item"
import { useKeyboardNavigation } from "./hooks/use-keyboard-navigation"
interface PageListProps {
	activeItemIndex: number | null
	setActiveItemIndex: React.Dispatch<React.SetStateAction<number | null>>
	disableEnterKey: boolean
}

export const COLUMN_STYLES = {
	title: { "--width": "69px", "--min-width": "200px", "--max-width": "200px" },
	content: { "--width": "auto", "--min-width": "200px", "--max-width": "200px" },
	topic: { "--width": "65px", "--min-width": "120px", "--max-width": "200px" },
	updated: { "--width": "82px", "--min-width": "82px", "--max-width": "82px" }
}

export const PageList: React.FC<PageListProps> = ({ activeItemIndex, setActiveItemIndex, disableEnterKey }) => {
	const [isCommandPaletteOpen] = useAtom(commandPaletteOpenAtom)
	const { me } = useAccount({ root: { personalPages: [] } })
	const personalPages = useMemo(() => me?.root?.personalPages || [], [me?.root?.personalPages])

	const { listRef, itemRefs } = useKeyboardNavigation({
		itemCount: personalPages.length,
		activeItemIndex,
		setActiveItemIndex,
		isCommandPaletteOpen,
		disableEnterKey
	})

	return (
		<div className="flex h-full w-full flex-col">
			<div className="flex h-8 shrink-0 grow-0 flex-row gap-1.5 border-b max-lg:px-4 sm:px-6">
				<Column.Wrapper style={COLUMN_STYLES.title}>
					<Column.Text>Title</Column.Text>
				</Column.Wrapper>
				<Column.Wrapper style={COLUMN_STYLES.content}>
					<Column.Text>Content</Column.Text>
				</Column.Wrapper>
				<Column.Wrapper style={COLUMN_STYLES.topic}>
					<Column.Text>Topic</Column.Text>
				</Column.Wrapper>
				<Column.Wrapper style={COLUMN_STYLES.updated} className="justify-end">
					<Column.Text>Updated</Column.Text>
				</Column.Wrapper>
			</div>

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
		</div>
	)
}

interface ColumnWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
	style?: { [key: string]: string }
}

interface ColumnTextProps extends React.HTMLAttributes<HTMLSpanElement> {}

const ColumnWrapper = React.forwardRef<HTMLDivElement, ColumnWrapperProps>(
	({ children, className, style, ...props }, ref) => {
		return (
			<div
				className={cn("flex grow flex-row items-center justify-start truncate", className)}
				style={{
					width: "var(--width)",
					minWidth: "var(--min-width, min-content)",
					maxWidth: "min(var(--width), var(--max-width))",
					flexBasis: "var(--width)",
					...style
				}}
				ref={ref}
				{...props}
			>
				{children}
			</div>
		)
	}
)

const ColumnText = React.forwardRef<HTMLSpanElement, ColumnTextProps>(({ children, className, ...props }, ref) => {
	return (
		<span className={cn("text-left text-xs", className)} ref={ref} {...props}>
			{children}
		</span>
	)
})

export const Column = {
	Wrapper: ColumnWrapper,
	Text: ColumnText
}
