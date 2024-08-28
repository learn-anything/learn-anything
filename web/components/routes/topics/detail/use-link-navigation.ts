import { useState, useRef, useCallback, useEffect } from "react"
import { Link as LinkSchema } from "@/lib/schema"
import { ensureUrlProtocol } from "@/lib/utils"

export function useLinkNavigation(allLinks: (LinkSchema | null)[]) {
	const [activeIndex, setActiveIndex] = useState(-1)
	const containerRef = useRef<HTMLDivElement>(null)
	const linkRefs = useRef<(HTMLLIElement | null)[]>(allLinks.map(() => null))

	const scrollToLink = useCallback((index: number) => {
		if (linkRefs.current[index] && containerRef.current) {
			const linkElement = linkRefs.current[index]
			const container = containerRef.current

			const linkRect = linkElement?.getBoundingClientRect()
			const containerRect = container.getBoundingClientRect()

			if (linkRect && containerRect) {
				if (linkRect.bottom > containerRect.bottom) {
					container.scrollTop += linkRect.bottom - containerRect.bottom
				} else if (linkRect.top < containerRect.top) {
					container.scrollTop -= containerRect.top - linkRect.top
				}
			}
		}
	}, [])

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			console.log("handleKeyDown")
			if (e.key === "ArrowDown") {
				e.preventDefault()
				setActiveIndex(prevIndex => {
					const newIndex = (prevIndex + 1) % allLinks.length
					scrollToLink(newIndex)
					return newIndex
				})
			} else if (e.key === "ArrowUp") {
				e.preventDefault()
				setActiveIndex(prevIndex => {
					const newIndex = (prevIndex - 1 + allLinks.length) % allLinks.length
					scrollToLink(newIndex)
					return newIndex
				})
			}

			console.log("activeIndex", activeIndex)
			// else if (e.key === "Enter" && activeIndex !== -1) {
			// 	const link = allLinks[activeIndex]
			// 	if (link) {
			// 		window.open(ensureUrlProtocol(link.url), "_blank")
			// 	}
			// }
		},
		[activeIndex, allLinks, scrollToLink]
	)

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [handleKeyDown])

	return { activeIndex, setActiveIndex, containerRef, linkRefs }
}
