import { useEffect, useRef, useCallback } from "react"

type ElementRef<T extends HTMLElement> = T | null
type ElementRefs<T extends HTMLElement> = ElementRef<T>[]

interface ActiveItemScrollOptions {
	activeIndex: number | null
}

export function useActiveItemScroll<T extends HTMLElement>(options: ActiveItemScrollOptions) {
	const { activeIndex } = options
	const elementRefs = useRef<ElementRefs<T>>([])

	const scrollActiveElementIntoView = (index: number) => {
		const activeElement = elementRefs.current[index]
		activeElement?.focus()
		// activeElement?.scrollIntoView({ block: "nearest" })
	}

	useEffect(() => {
		if (activeIndex !== null) {
			scrollActiveElementIntoView(activeIndex)
		}
	}, [activeIndex, scrollActiveElementIntoView])

	const setElementRef = useCallback((element: ElementRef<T>, index: number) => {
		elementRefs.current[index] = element
	}, [])

	return { setElementRef, scrollActiveElementIntoView }
}
