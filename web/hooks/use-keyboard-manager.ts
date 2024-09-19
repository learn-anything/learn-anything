import { isModalActiveAtom } from "@/store/keydown-manager"
import { useAtom } from "jotai"
import { useEffect, useCallback } from "react"

export function useKeyboardManager() {
	const [isModalActive, setIsModalActive] = useAtom(isModalActiveAtom)

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (isModalActive) {
				event.preventDefault()
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [isModalActive])

	const openModal = useCallback(() => {
		setIsModalActive(true)
	}, [setIsModalActive])

	const closeModal = useCallback(() => {
		setIsModalActive(false)
	}, [setIsModalActive])

	return { openModal, closeModal, isModalActive }
}
