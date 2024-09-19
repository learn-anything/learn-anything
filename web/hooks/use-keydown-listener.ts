import { useAtomValue } from "jotai"
import { useEffect, useCallback } from "react"
import { keyboardDisableSourcesAtom } from "@/store/keydown-manager"

export function useKeydownListener(callback: (event: KeyboardEvent) => void) {
	const disableSources = useAtomValue(keyboardDisableSourcesAtom)

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (disableSources.size === 0) {
				callback(event)
			}
		},
		[disableSources, callback]
	)

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [handleKeyDown])
}
