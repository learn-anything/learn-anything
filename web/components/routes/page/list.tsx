import React, { useMemo } from "react"
import { Primitive } from "@radix-ui/react-primitive"
import { cn } from "@/lib/utils"
import { useAccount } from "@/lib/providers/jazz-provider"
import { useAtom } from "jotai"
import { commandPaletteOpenAtom } from "@/components/custom/command-palette/command-palette"
import { PageItem } from "./page-item"
import { useKeyboardNavigation } from "./hooks/use-keyboard-navigation"
import styles from "./list.module.css"

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

interface ColumnHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	style: { [key: string]: string }
}

export const ColumnHeader = React.forwardRef<HTMLDivElement, ColumnHeaderProps>(
	({ children, style, ...props }, ref) => {
		return (
			<div
				className={cn("flex-start flex shrink-[2] grow flex-row items-center truncate", styles.column)}
				style={style}
				ref={ref}
				{...props}
			>
				{children}
			</div>
		)
	}
)

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
			<div className="flex h-8 shrink-0 grow-0 flex-row gap-1.5 border-b max-lg:px-4 sm:px-5">
				<ColumnHeader style={COLUMN_STYLES.title}>
					<span className="text-left text-xs">Title</span>
				</ColumnHeader>
				<ColumnHeader style={COLUMN_STYLES.content}>
					<span className="text-left text-xs">Content</span>
				</ColumnHeader>
				<ColumnHeader style={COLUMN_STYLES.topic}>
					<span className="text-left text-xs">Topic</span>
				</ColumnHeader>
				<ColumnHeader style={COLUMN_STYLES.updated}>
					<span className="text-left text-xs">Updated</span>
				</ColumnHeader>
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
								index={index}
								page={page}
								isActive={index === activeItemIndex}
								setActiveItemIndex={setActiveItemIndex}
							/>
						)
				)}
			</Primitive.div>
		</div>
	)
}
