import { useAtom } from "jotai"
import { useEffect, useCallback } from "react"
import { keyboardDisableSourcesAtom } from "@/store/keydown-manager"

export function useKeyboardManager(sourceId: string) {
	const [disableSources, setDisableSources] = useAtom(keyboardDisableSourcesAtom)

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (disableSources.size > 0) {
				event.preventDefault()
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [disableSources])

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

	const isKeyboardDisabled = disableSources.size > 0

	return { disableKeydown, isKeyboardDisabled }
}
