import { useEffect, useRef, useCallback } from "react"

interface UseKeyboardNavigationProps {
	itemCount: number
	activeItemIndex: number | null
	setActiveItemIndex: React.Dispatch<React.SetStateAction<number | null>>
	isCommandPaletteOpen: boolean
	disableEnterKey: boolean
}

export const useKeyboardNavigation = ({
	itemCount,
	activeItemIndex,
	setActiveItemIndex,
	isCommandPaletteOpen,
	disableEnterKey
}: UseKeyboardNavigationProps) => {
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
			if (isCommandPaletteOpen) return

			if (e.key === "ArrowUp" || e.key === "ArrowDown") {
				e.preventDefault()
				setActiveItemIndex(prevIndex => {
					if (prevIndex === null) return 0
					const newIndex = e.key === "ArrowUp" ? Math.max(0, prevIndex - 1) : Math.min(itemCount - 1, prevIndex + 1)
					return newIndex
				})
			} else if (e.key === "Enter" && !disableEnterKey) {
				e.preventDefault()
				if (activeItemIndex !== null) {
					// Handle active page selection
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [itemCount, isCommandPaletteOpen, activeItemIndex, setActiveItemIndex, disableEnterKey])

	return { listRef, itemRefs }
}
