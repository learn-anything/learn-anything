// import { useState, useRef, useCallback, useEffect } from "react"
// import { Link as LinkSchema, Section as SectionSchema } from "@/lib/schema"
// import { ensureUrlProtocol } from "@/lib/utils"

// interface TransformedDataItem<T> {
// 	type: string
// 	data: T | null
// }

// type TransformedData<S, L> = Array<TransformedDataItem<S> | TransformedDataItem<L>>

// interface UseLinkNavigationProps<S, L> {
// 	transformedData: TransformedData<S, L>
// }

// export function useLinkNavigation({ transformedData }: UseLinkNavigationProps<SectionSchema, LinkSchema>) {
// 	const [activeIndex, setActiveIndex] = useState(-1)
// 	const containerRef = useRef<HTMLDivElement>(null)
// 	const linkRefs = useRef<(HTMLLIElement | null)[]>([])

// 	const allLinks = transformedData.filter(
// 		(item): item is TransformedDataItem<LinkSchema> => item.type === "link" && item.data !== null
// 	)

// 	const scrollToLink = useCallback((index: number) => {
// 		if (linkRefs.current[index] && containerRef.current) {
// 			const linkElement = linkRefs.current[index]
// 			const container = containerRef.current

// 			const linkRect = linkElement?.getBoundingClientRect()
// 			const containerRect = container.getBoundingClientRect()

// 			if (linkRect && containerRect) {
// 				if (linkRect.bottom > containerRect.bottom) {
// 					container.scrollTop += linkRect.bottom - containerRect.bottom
// 				} else if (linkRect.top < containerRect.top) {
// 					container.scrollTop -= containerRect.top - linkRect.top
// 				}
// 			}
// 		}
// 	}, [])

// 	const handleKeyDown = useCallback(
// 		(e: KeyboardEvent) => {
// 			if (e.key === "ArrowDown") {
// 				e.preventDefault()
// 				setActiveIndex(prevIndex => {
// 					const newIndex = (prevIndex + 1) % allLinks.length
// 					scrollToLink(newIndex)
// 					return newIndex
// 				})
// 			} else if (e.key === "ArrowUp") {
// 				e.preventDefault()
// 				setActiveIndex(prevIndex => {
// 					const newIndex = (prevIndex - 1 + allLinks.length) % allLinks.length
// 					scrollToLink(newIndex)
// 					return newIndex
// 				})
// 			} else if (e.key === "Enter" && activeIndex !== -1) {
// 				const linkItem = allLinks[activeIndex]
// 				if (linkItem && linkItem.data) {
// 					window.open(ensureUrlProtocol(linkItem.data.url), "_blank")
// 				}
// 			}
// 		},
// 		[activeIndex, allLinks, scrollToLink]
// 	)

// 	useEffect(() => {
// 		window.addEventListener("keydown", handleKeyDown)
// 		return () => window.removeEventListener("keydown", handleKeyDown)
// 	}, [handleKeyDown])

// 	useEffect(() => {
// 		linkRefs.current = linkRefs.current.slice(0, allLinks.length)
// 	}, [allLinks])

// 	return { activeIndex, setActiveIndex, containerRef, linkRefs }
// }

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
			} else if (e.key === "Enter" && activeIndex !== -1) {
				const link = allLinks[activeIndex]
				if (link) {
					window.open(ensureUrlProtocol(link.url), "_blank")
				}
			}
		},
		[activeIndex, allLinks, scrollToLink]
	)

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [handleKeyDown])

	return { activeIndex, setActiveIndex, containerRef, linkRefs }
}
