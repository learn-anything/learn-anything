import React, { useEffect, useRef, useCallback } from "react"
import { PersonalPage, PersonalPageLists } from "@/lib/schema"

interface UseKeyboardNavigationProps {
	personalPages?: PersonalPageLists | null
	activeItemIndex: number | null
	setActiveItemIndex: React.Dispatch<React.SetStateAction<number | null>>
	isCommandPaletteOpen: boolean
	disableEnterKey: boolean
	onEnter?: (selectedPage: PersonalPage) => void
}

export const useKeyboardNavigation = ({
	personalPages,
	activeItemIndex,
	setActiveItemIndex,
	isCommandPaletteOpen,
	disableEnterKey,
	onEnter
}: UseKeyboardNavigationProps) => {
	const listRef = useRef<HTMLDivElement>(null)
	const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
	const itemCount = personalPages?.length || 0

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
				if (selectedPage) onEnter?.(selectedPage)
			}
		},
		[itemCount, isCommandPaletteOpen, activeItemIndex, setActiveItemIndex, disableEnterKey, personalPages, onEnter]
	)

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [handleKeyDown])

	const setItemRef = useCallback((el: HTMLAnchorElement | null, index: number) => {
		itemRefs.current[index] = el
	}, [])

	return { listRef, setItemRef }
}
