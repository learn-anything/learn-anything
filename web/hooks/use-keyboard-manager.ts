import { useAtom } from "jotai"
import { useEffect, useCallback } from "react"
import { keyboardDisableSourcesAtom } from "@/store/keydown-manager"

const allowedKeys = [
	"Escape",
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Enter",
	"Tab",
	"Backspace",
	"Home",
	"End"
]

export function useKeyboardManager(sourceId: string) {
	const [disableSources, setDisableSources] = useAtom(keyboardDisableSourcesAtom)

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (disableSources.has(sourceId)) {
				if (allowedKeys.includes(event.key)) {
					if (event.key === "Escape") {
						setDisableSources(prev => {
							const next = new Set(prev)
							next.delete(sourceId)
							return next
						})
					}
				} else {
					event.stopPropagation()
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown, true)
		return () => window.removeEventListener("keydown", handleKeyDown, true)
	}, [disableSources, sourceId, setDisableSources])

	const disableKeydown = useCallback(
		(disable: boolean) => {
			console.log(`${sourceId} disable:`, disable)
			setDisableSources(prev => {
				const next = new Set(prev)
				if (disable) {
					next.add(sourceId)
				} else {
					next.delete(sourceId)
				}
				return next
			})
		},
		[setDisableSources, sourceId]
	)

	const isKeyboardDisabled = disableSources.has(sourceId)

	return { disableKeydown, isKeyboardDisabled }
}
