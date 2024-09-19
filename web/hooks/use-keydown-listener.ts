import { isModalActiveAtom } from "@/store/keydown-manager"
import { useAtomValue } from "jotai"
import { useEffect, useCallback } from "react"

export function useKeydownListener(callback: (event: KeyboardEvent) => void) {
	const isModalActive = useAtomValue(isModalActiveAtom)

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!isModalActive) {
				callback(event)
			}
		},
		[isModalActive, callback]
	)

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [handleKeyDown])
}
